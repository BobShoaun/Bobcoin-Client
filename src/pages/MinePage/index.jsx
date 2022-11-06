import { useState, useEffect, useRef, useContext, createContext } from "react";
import { useSelector } from "react-redux";

import Blockchain from "../../components/Blockchain/";
import MineMempool from "./MineMempool";
import MineSuccessModal from "./MineSuccessModal";
import MineFailureModal from "./MineFailureModal";
import Terminal from "./Terminal";

import {
  calculateBlockReward,
  signTransaction,
  calculateTransactionHash,
  hexToBase58,
  createInput,
  createOutput,
  calculateMerkleRoot,
  calculateHashTarget,
  createTransaction,
  bigIntToHex64,
} from "blockcrypto";
import { VCODE, nodeDonationAddress, nodeDonationPercent } from "../../config";

import Miner from "./miner.worker";

import Loading from "../../components/Loading";

import "./mine.css";
import axios from "axios";
import toast from "react-hot-toast";

export const MinePageContext = createContext();

const MinePage = () => {
  const { headBlock, headBlockLoaded, mempool } = useSelector(state => state.blockchain);
  const { params, paramsLoaded } = useSelector(state => state.consensus);
  const { externalKeys, keys } = useSelector(state => state.wallet);

  const minerAddress = externalKeys[externalKeys.length - 1]?.addr ?? keys.address ?? "";
  const minerPublicKey = externalKeys[externalKeys.length - 1]?.pk ?? keys.pk ?? "";
  const minerSecretKey = externalKeys[externalKeys.length - 1]?.sk ?? keys.sk ?? "";

  const [mineInfo, setMineInfo] = useState(null);
  const [miner, setMiner] = useState(minerAddress);
  const [parentBlockHash, setParentBlockHash] = useState("");
  const [isAutoRestart, setIsAutoRestart] = useState(true);
  const [isKeepMining, setIsKeepMining] = useState(true);

  const [terminalLogs, setTerminalLogs] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState({});
  const [selectedTxs, setSelectedTxs] = useState([]);
  const activeWorker = useRef(null);
  const startMiningTimeout = useRef(null);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/mine/info");
      setMineInfo(data);
    })();
    return () => {
      // terminate worker when leaving page / component
      clearTimeout(startMiningTimeout.current);
      console.log("terminating worker", activeWorker.current);
      activeWorker.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!headBlock) return;
    setParentBlockHash(headBlock.hash);
    if (isAutoRestart) {
      console.log("new head block hash, restarting", headBlock.hash);
      restartMining();
    }
  }, [headBlock]);

  useEffect(() => {
    if (!mempool.length) return;
    setSelectedTxs([mempool[0]]);
  }, [mempool]);

  const restartMining = () => {
    if (activeWorker.current) {
      activeWorker.current.terminate();
      activeWorker.current = null;
      setTerminalLogs(log => [...log, `\nNew head block found, mining operation restarting...`]);
      startMiningTimeout.current = setTimeout(startMining, 2000);
    }
  };

  const stopMining = () => {
    if (activeWorker.current) {
      activeWorker.current.terminate();
      activeWorker.current = null;
      setTerminalLogs(log => [...log, `\nMining operation stopped.`]);
      return;
    }
    setTerminalLogs(log => [...log, `\nNo mining processes running.`]);
  };

  const loading = !paramsLoaded || !headBlockLoaded;

  if (loading)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  const startMining = async () => {
    if (activeWorker.current) {
      setTerminalLogs(log => [
        ...log,
        `\nAnother mining process is currently running, to terminate it type 'mine stop'.`,
      ]);
      return;
    }

    setTerminalLogs(log => [...log, "\nForming and verifying candidate block..."]);

    selectedTxs.sort((a, b) => a.timestamp - b.timestamp);
    const { data } = await axios.post("/mine/candidate-block/info", { parentBlockHash, transactions: selectedTxs });
    const { previousBlock, difficulty, fees } = data;

    const blockReward = calculateBlockReward(params, previousBlock.height + 1);
    const coinbaseAmount = blockReward + fees;
    const donationAmount = Math.floor(blockReward * nodeDonationPercent);

    // coinbase transaction
    const coinbaseOutput = createOutput(miner, coinbaseAmount);
    const coinbase = createTransaction(params, [], [coinbaseOutput]);
    coinbase.hash = calculateTransactionHash(coinbase);

    // donation transaction
    const donationOutput = createOutput(nodeDonationAddress, donationAmount);
    const donationChangeOutput = createOutput(miner, coinbaseAmount - donationAmount);
    const donationInput = createInput(coinbase.hash, 0, minerPublicKey);
    const donation = createTransaction(params, [donationInput], [donationOutput, donationChangeOutput]);
    const donationInputSignature = signTransaction(donation, hexToBase58(minerSecretKey));
    donation.inputs.forEach(input => (input.signature = donationInputSignature));
    donation.hash = calculateTransactionHash(donation);

    const transactions = [coinbase, donation, ...selectedTxs];
    const block = {
      height: previousBlock.height + 1,
      previousHash: previousBlock.hash,
      transactions,
      timestamp: Date.now(),
      version: params.version,
      difficulty,
      merkleRoot: calculateMerkleRoot(transactions.map(tx => tx.hash)),
      nonce: 0,
      hash: "",
    };
    const target = calculateHashTarget(params, block);

    // if (validation.code !== VCODE.VALID) {
    //   console.error("Candidate block is invalid, not mining: ", block);
    //   setError(validation);
    //   setErrorModal(true);
    //   return;
    // }

    setTerminalLogs(log => [
      ...log,
      `Mining started...\nprevious block: ${previousBlock.hash}\ntarget hash: ${bigIntToHex64(target)}\n `,
    ]);

    const worker = new Miner();
    worker.postMessage({ block, target });
    activeWorker.current = worker;

    worker.addEventListener("message", async ({ data }) => {
      switch (data.message) {
        case "nonce":
          setTerminalLogs(log => [...log, `nonce reached: ${data.block.nonce}`]);
          break;

        case "success":
          setTerminalLogs(log => [
            ...log,
            `\nMining successful! New block mined with...\nhash: ${data.block.hash}\nnonce: ${data.block.nonce}`,
          ]);
          activeWorker.current = null;
          setSelectedTxs([]);

          const { validation, blockInfo } = (await axios.post(`/block`, data.block)).data;

          if (validation.code !== VCODE.VALID) {
            console.error("Block is invalid", blockInfo);
            setError(validation);
            setErrorModal(true);
            break;
          }

          if (isKeepMining) {
            startMiningTimeout.current = setTimeout(startMining, 2000);
            return;
          }

          setSuccessModal(true);

          if (Notification.permission === "default")
            // ask user for permission
            await Notification.requestPermission();

          if (Notification.permission === "granted") {
            const notification = new Notification("Bobcoins mined!", {
              body: "You have successfully mined a block",
              // icon:
            });
            notification.onclick = () => window.focus();
          }
          break;
        default:
          console.error("invalid worker case");
      }
    });
  };

  return (
    <MinePageContext.Provider
      value={{
        terminalLogs,
        miner,
        parentBlockHash,
        isAutoRestart,
        isKeepMining,
        setTerminalLogs,
        startMining,
        stopMining,
        setMiner,
        setParentBlockHash,
        setIsAutoRestart,
        setIsKeepMining,
      }}
    >
      <main className="section">
        <h1 className="title is-size-4 is-size-2-tablet">Mining Dashboard</h1>
        <p className="subtitle is-size-6 is-size-5-tablet">
          Mine from the comfort of your browser! No need for unnecessary mining clients.
        </p>

        <hr className="has-background-grey-light" />

        <div className="mb-6">
          <Blockchain showHead>
            <div className="mr-auto" style={{ fontSize: ".95em" }}>
              <p>
                Current difficulty:{" "}
                <span className="has-text-weight-semibold">{mineInfo?.difficulty.toFixed(4) ?? "-"}</span>
              </p>
              <p>
                Concurrent users: <span className="has-text-weight-semibold">{mineInfo?.numClients ?? "-"}</span>
              </p>
            </div>
          </Blockchain>
        </div>

        <section className="is-flex-tablet mb-5" style={{ gap: "3em" }}>
          <Terminal />
          <section className="mb-6">
            <div className="field mb-4">
              <label className="label mb-0">Miner's address</label>
              <p className="is-size-7 mb-1">The address of the miner, where to send block reward and fees.</p>

              <div className="field has-addons mb-0">
                <div className="control is-expanded">
                  <input
                    readOnly
                    // onChange={({ target }) => setMiner(target.value)}
                    value={miner}
                    className="input"
                    type="text"
                    placeholder="Miner's address"
                    onClick={e => e.target.select()}
                  />
                </div>
                <p className="control">
                  <button
                    title="Paste address from clipboard"
                    onClick={async () => {
                      // setMiner(await navigator.clipboard.readText());
                      // toast.success("Address pasted");
                    }}
                    className="button"
                  >
                    <i className="material-icons md-18">content_paste</i>
                  </button>
                </p>
              </div>
            </div>

            <div className="field mb-5">
              <label className="label mb-0">Parent block</label>
              <p className="is-size-7 mb-1">Previous block to mine from, usually the head block.</p>

              <div className="field has-addons mb-0">
                <div className="control is-expanded">
                  <input
                    onChange={e => setParentBlockHash(e.target.value)}
                    readOnly
                    value={parentBlockHash}
                    className="input"
                    type="text"
                    placeholder={headBlock.hash}
                    onClick={e => e.target.select()}
                  />
                </div>
                <p className="control">
                  <button
                    onClick={async () => {
                      setParentBlockHash(await navigator.clipboard.readText());
                      toast.success("Parent block hash pasted");
                    }}
                    className="button"
                  >
                    <i className="material-icons md-18">content_paste</i>
                  </button>
                </p>
              </div>

              {parentBlockHash !== headBlock?.hash && (
                <p className="help is-danger is-flex">
                  <span className="material-icons-outlined md-18 mr-2">warning</span>You are no longer mining from the
                  latest block.
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="checkbox is-flex" style={{ gap: ".5em" }}>
                <input type="checkbox" checked={isAutoRestart} onChange={e => setIsAutoRestart(e.target.checked)} />
                <div>
                  <h3 className="label mb-0">Auto Restart</h3>
                  <p className="is-size-7">Restart mining automatically when new head block is discovered.</p>
                </div>
              </label>
            </div>

            <div className="mb-6">
              <label className="checkbox is-flex" style={{ gap: ".5em" }}>
                <input type="checkbox" checked={isKeepMining} onChange={e => setIsKeepMining(e.target.checked)} />
                <div>
                  <h3 className="label mb-0">Keep Mining</h3>
                  <p className="is-size-7">Don't show success prompt, keep mining the next block after.</p>
                </div>
              </label>
            </div>

            <div className="has-text-right">
              <button onClick={activeWorker.current ? stopMining : startMining} className="button mb-0">
                <i className="material-icons mr-2">memory</i>
                {activeWorker.current ? "Stop mining" : "Start mining"}
              </button>
            </div>
          </section>
        </section>

        <div className="is-flex is-align-items-center mb-5">
          <div>
            <h3 className="title is-4">Mempool</h3>
            <p className="subtitle is-6 ">Select transactions to include from the mempool.</p>
          </div>
          {/* <button className="button ml-auto">
					<span className="material-icons-outlined md-18 mr-2">refresh</span>Refresh
				</button> */}
        </div>
        <MineMempool
          selectedTransactions={selectedTxs}
          toggleSelected={(value, tx) => {
            console.log("change ", value, tx);
            if (value) setSelectedTxs(txs => [...txs, tx]);
            else setSelectedTxs(txs => txs.filter(tx2 => tx2.hash !== tx.hash));
          }}
        />

        <MineSuccessModal
          isOpen={successModal}
          close={() => setSuccessModal(false)}
          params={params}
          blockReward={(calculateBlockReward(params, headBlock.height) / params.coin).toFixed(8)}
        />

        <MineFailureModal isOpen={errorModal} close={() => setErrorModal(false)} error={error} />
      </main>
    </MinePageContext.Provider>
  );
};

export default MinePage;
