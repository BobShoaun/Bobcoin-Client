import { useState, useEffect, useRef, useContext, createContext, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { calculateBlockReward, calculateHashTarget, bigIntToHex64, hexToBigInt } from "blockcrypto";

import Blockchain from "../../components/Blockchain/";
import MineMempool from "./MineMempool";
import MineSuccessModal from "./MineSuccessModal";
import MineFailureModal from "./MineFailureModal";
import Terminal from "./Terminal";
import { VCODE } from "../../config";
import { MinePageContext } from ".";
import Miner from "./miner.worker";

import "./mine.css";

const SoloMiner = () => {
  const {
    miningMode,
    setMiningMode,
    tab,
    selectedTransactions,
    miner,
    parentBlockHash,
    isAutoRestart,
    isKeepMining,
    setTerminalLogs,
    setMiner,
    setParentBlockHash,
    setIsAutoRestart,
    setIsKeepMining,
    setError,
    setErrorModal,
    setSelectedTransactions,
  } = useContext(MinePageContext);

  const { headBlock } = useSelector(state => state.blockchain);
  const { params } = useSelector(state => state.consensus);

  const [successModal, setSuccessModal] = useState(false);
  const miningController = useRef(null);

  useEffect(() => {
    return () => {
      miningController.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!headBlock) return;
    setParentBlockHash(headBlock.hash);
  }, [headBlock]);

  useEffect(() => {
    if (miningMode !== "solo") {
      if (!miningController.current) return;
      // stop mining
      miningController.current.abort();
      miningController.current = null;
      setTerminalLogs(log => [...log, `\nMining operation stopped.`]);
    }
    if (miningMode === "solo") {
      startMining();
    }
  }, [miningMode]);

  useEffect(() => {
    if (miningMode !== "solo") return;
    if (isAutoRestart && miningController.current) {
      console.log("new head block hash, restarting", headBlock.hash);
      miningController.current.abort();
      miningController.current = null;
      setTerminalLogs(log => [...log, `\nNew head block found, mining operation restarting...`]);
      startMining();
      return;
    }
    if (isKeepMining) startMining();
  }, [parentBlockHash]);

  const startMining = async () => {
    miningController.current = new AbortController();

    setTerminalLogs(log => [...log, "\nForming and verifying candidate block..."]);

    selectedTransactions.sort((a, b) => a.timestamp - b.timestamp);

    let response = null;
    try {
      response = await axios.post(
        "/mine/candidate-block",
        {
          previousBlockHash: parentBlockHash,
          miner,
          transactions: selectedTransactions,
        },
        { signal: miningController.current.signal }
      );
    } catch (error) {
      miningController.current = null;
      setMiningMode(null);
      if (error.message === "canceled") return;
      setTerminalLogs(log => [...log, error.response?.data]);
      return;
    }

    const { validation, candidateBlock } = response.data;

    if (validation.code !== VCODE.VALID) {
      console.error("Candidate block is invalid, not mining: ", candidateBlock);
      setError(validation);
      setErrorModal(true);
      miningController.current = null;
      setMiningMode(null);
      return;
    }

    const target = calculateHashTarget(params, candidateBlock);

    setTerminalLogs(log => [
      ...log,
      `previous block: ${candidateBlock.previousHash}\ntarget hash: ${bigIntToHex64(target)}\nMining started...`,
    ]);

    const worker = new Miner();
    worker.postMessage({ type: "solo", block: candidateBlock, target });
    worker.addEventListener("message", async ({ data }) => {
      switch (data.message) {
        case "nonce":
          setTerminalLogs(log => [...log, `nonce reached: ${data.block.nonce}`]);
          break;

        case "success":
          worker.terminate();
          miningController.current = null;

          setTerminalLogs(log => [
            ...log,
            `\nMining successful! New block mined with...\nhash: ${data.block.hash}\nnonce: ${data.block.nonce}`,
          ]);
          setSelectedTransactions([]);

          const { validation, blockInfo } = (await axios.post(`/block`, data.block)).data;

          if (validation.code !== VCODE.VALID) {
            console.error("Block is invalid", blockInfo);
            setError(validation);
            setErrorModal(true);
            break;
          }

          if (isKeepMining) return;

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
          setMiningMode(null);

          break;
        default:
          console.error("invalid worker case");
      }
    });
    miningController.current.signal.addEventListener("abort", () => worker.terminate());
  };

  return (
    <section>
      <div className="field mb-4">
        <label className="label mb-0">Miner's address</label>
        <p className="is-size-7 mb-1">The address of the miner, where to send block reward and fees.</p>

        <div className="field has-addons mb-0">
          <div className="control is-expanded">
            <input
              readOnly
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
              title="Paste address from clipboard"
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
      </div>

      <div className="field">
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
            <span className="material-icons-outlined md-18 mr-2">warning</span>You are not mining from the latest block.
          </p>
        )}
      </div>

      <div className="mb-5 mt-5">
        <label className="checkbox is-flex" style={{ gap: ".5em" }}>
          <input type="checkbox" checked={isAutoRestart} onChange={e => setIsAutoRestart(e.target.checked)} />
          <div>
            <h3 className="label mb-0">Auto Re-mine</h3>
            <p className="is-size-7">Always mine from the head block, restart when new head block is found.</p>
          </div>
        </label>
      </div>

      <div className="mb-5">
        <label className="checkbox is-flex" style={{ gap: ".5em" }}>
          <input type="checkbox" checked={isKeepMining} onChange={e => setIsKeepMining(e.target.checked)} />
          <div>
            <h3 className="label mb-0">Keep Mining</h3>
            <p className="is-size-7">Don't show success prompt, keep mining the next block after.</p>
          </div>
        </label>
      </div>

      <div className="has-text-right">
        <button
          onClick={() => (miningMode === "solo" ? setMiningMode(null) : setMiningMode("solo"))}
          className="button mb-0"
        >
          <i className="material-icons mr-2">memory</i>
          {miningMode === "solo" ? "Stop mining" : "Start mining"}
        </button>
      </div>

      <MineSuccessModal
        isOpen={successModal}
        close={() => setSuccessModal(false)}
        // blockReward={(calculateBlockReward(params, headBlock.height) / params.coin).toFixed(8)}
      />
    </section>
  );
};

export default SoloMiner;
