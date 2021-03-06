import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import Blockchain from "../../components/Blockchain/";
import MineMempool from "./MineMempool";
import MineSuccessModal from "./MineSuccessModal";
import MineFailureModal from "./MineFailureModal";

import { calculateBlockReward, RESULT, hexToBigInt } from "blockcrypto";

import Miner from "./miner.worker";

import Loading from "../../components/Loading";

import "./mine.css";
import axios from "axios";
import toast from "react-hot-toast";

const MinePage = () => {
  const { headBlock, headBlockLoaded } = useSelector(state => state.blockchain);
  const { params, paramsLoaded } = useSelector(state => state.consensus);

  const keys = useSelector(state => state.wallet.keys);
  const { externalKeys } = useSelector(state => state.wallet);

  const [mineInfo, setMineInfo] = useState(null);
  const [miner, setMiner] = useState(externalKeys[externalKeys.length - 1]?.addr ?? keys.address ?? "");
  const [parentBlockHash, setParentBlockHash] = useState("");

  const [terminalLog, setTerminalLog] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState({});
  const [selectedTxs, setSelectedTxs] = useState([]);
  const activeWorker = useRef(null);

  useEffect(() => {
    if (headBlock) setParentBlockHash(headBlock.hash);
  }, [headBlock]);

  useEffect(
    () => () => {
      // terminate worker when leaving page / component
      console.log("terminating worker", activeWorker.current);
      activeWorker.current?.terminate();
    },
    []
  );

  useEffect(
    () =>
      (async () => {
        const { data } = await axios.get("/mine/info");
        setMineInfo(data);
      })(),
    []
  );

  const loading = !paramsLoaded || !headBlockLoaded;

  if (loading)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  const startMining = async () => {
    if (activeWorker.current) {
      setTerminalLog(log => [
        ...log,
        `\nAnother mining process is currently running, to terminate it type 'mine stop'.`,
      ]);
      return;
    }

    setTerminalLog(log => [...log, "\nForming and verifying candidate block..."]);

    const results = await axios.post(`/mine/candidate-block`, {
      previousBlockHash: parentBlockHash,
      miner,
      transactions: selectedTxs.sort((a, b) => a.timestamp - b.timestamp),
    });

    const { block, validation, target } = results.data;

    if (validation.code !== RESULT.VALID) {
      console.error("Candidate block is invalid, not mining: ", block);
      setError(validation);
      setErrorModal(true);
      return;
    }

    setTerminalLog(log => [...log, `Mining started...\nprevious block: ${parentBlockHash}\ntarget hash: ${target}\n `]);

    const worker = new Miner();
    worker.postMessage({ block, target: hexToBigInt(target) });
    activeWorker.current = worker;

    worker.addEventListener("message", async ({ data }) => {
      switch (data.message) {
        case "nonce":
          setTerminalLog(log => [...log, `nonce reached: ${data.block.nonce}`]);
          break;

        case "success":
          setTerminalLog(log => [
            ...log,
            `\nMining successful! New block mined with...\nhash: ${data.block.hash}\nnonce: ${data.block.nonce}`,
          ]);
          activeWorker.current = null;

          const { validation, blockInfo } = (await axios.post(`/block`, data.block)).data;

          if (validation.code !== RESULT.VALID) {
            console.error("Block is invalid", blockInfo);
            setError(validation);
            setErrorModal(true);
            break;
          }

          setSelectedTxs([]);
          setSuccessModal(true);

          if (Notification.permission !== "denied")
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

  const stopMining = () => {
    if (activeWorker.current) {
      activeWorker.current.terminate();
      activeWorker.current = null;
      setTerminalLog(log => [...log, `\nMining operation stopped.`]);
      return;
    }
    setTerminalLog(log => [...log, `\nNo mining processes running.`]);
  };

  const programs = [
    {
      name: "mine",
      template: "mine [start | stop]",
      execute: args => {
        const operation = args[1];
        switch (operation) {
          case "start":
            return startMining();
          case "stop":
            return stopMining();
          default:
            throw Error("invalid arguments");
        }
      },
    },
    {
      name: "set",
      template: "set [miner | parent] <value>",
      execute: args => {
        const type = args[1];
        const value = args[2];
        switch (type) {
          case "miner":
            return setMiner(value);
          case "parent":
            return setParentBlockHash(value);
          default:
            throw Error("invalid arguments");
        }
      },
    },
    {
      name: "help",
      template: "help",
      execute: () => {
        setTerminalLog(log => [
          ...log,
          `\nCrappy ${params.name} mining terminal v1.1.0\n\nList of commands:\n${programs
            .map(program => program.template)
            .join("\n")}`,
        ]);
      },
    },
  ];

  const submitCommand = event => {
    event.preventDefault();
    const args = event.target.command.value.split(" ");
    event.target.command.value = "";

    const program = programs.find(program => program.name === args[0]);
    if (!program) {
      setTerminalLog(log => [...log, `\nUnknown command: ${args[0]}, type 'help' for help.`]);
      return;
    }

    try {
      program.execute(args);
    } catch (e) {
      setTerminalLog(log => [...log, e.toString()]);
    }
  };

  return (
    <section className="section">
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
        <section className="terminal mb-5" style={{ flex: "1 0 10em" }}>
          <div className="mt-auto content" style={{ width: "100%" }}>
            {terminalLog.map((log, index) => (
              <pre className="terminal-output" key={index}>
                {log}
              </pre>
            ))}
            <div className="is-flex is-align-items-center">
              <span className="mr-2 has-text-weight-bold">&gt;</span>
              <form onSubmit={submitCommand} className="is-block" style={{ width: "100%" }}>
                <input
                  className="terminal-input"
                  name="command"
                  type="text"
                  autoComplete="off"
                  style={{ width: "100%" }}
                />
              </form>
            </div>
          </div>
        </section>
        <section className="mb-6">
          <div className="field mb-4">
            <label className="label">Miner's address</label>
            <div className="field has-addons mb-0">
              <div className="control is-expanded">
                <input
                  onChange={({ target }) => setMiner(target.value)}
                  value={miner}
                  className="input"
                  type="text"
                  placeholder="Miner's address"
                  onClick={e => e.target.select()}
                />
              </div>
              <p className="control">
                <button
                  onClick={async () => {
                    setMiner(await navigator.clipboard.readText());
                    toast.success("Address pasted");
                  }}
                  className="button"
                >
                  <i className="material-icons md-18">content_paste</i>
                </button>
              </p>
            </div>
            <p className="help">The address of the miner, where to send block reward and fees.</p>
          </div>

          <div className="field mb-5">
            <label className="label">Parent block</label>

            <div className="field has-addons mb-0">
              <div className="control is-expanded">
                <input
                  onChange={e => setParentBlockHash(e.target.value)}
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
                    toast.success("Block hash pasted");
                  }}
                  className="button"
                >
                  <i className="material-icons md-18">content_paste</i>
                </button>
              </p>
            </div>

            <p className="help">Previous block to mine from, usually the head block.</p>
            {/* {prevBlock?.hash !== headBlock?.hash && (
							<p className="help is-danger is-flex">
								<span className="material-icons-outlined md-18 mr-2">warning</span>You are no longer
								mining from the latest block.
							</p>
						)} */}
          </div>

          <button onClick={activeWorker.current ? stopMining : startMining} className="button mb-0">
            <i className="material-icons mr-2">memory</i>
            {activeWorker.current ? "Stop mining" : "Start mining"}
          </button>
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
        addTransaction={tx => setSelectedTxs(txs => [...txs, tx])}
        removeTransaction={tx => setSelectedTxs(txs => txs.filter(tx2 => tx2.hash !== tx.hash))}
      />

      <MineSuccessModal
        isOpen={successModal}
        close={() => setSuccessModal(false)}
        params={params}
        blockReward={(calculateBlockReward(params, headBlock.height) / params.coin).toFixed(8)}
      />

      <MineFailureModal isOpen={errorModal} close={() => setErrorModal(false)} error={error} />
    </section>
  );
};

export default MinePage;
