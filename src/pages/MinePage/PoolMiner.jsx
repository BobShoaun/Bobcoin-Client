/* global BigInt */
import { useState, useEffect, useRef, useContext, createContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { calculateBlockReward, calculateHashTarget, bigIntToHex64, hexToBigInt } from "blockcrypto";

import MineMempool from "./MineMempool";
import MineSuccessModal from "./MineSuccessModal";
import MineFailureModal from "./MineFailureModal";
import Terminal from "./Terminal";
import { VCODE } from "../../config";
import { MinePageContext } from ".";
import Miner from "./miner.worker";

import "./mine.css";

const calculateUnclampedHashTarget = (params, block) => {
  // divide by multiplying divisor by 1000 then dividing results by 1000
  const initHashTarget = hexToBigInt(params.initHashTarg);
  const hashTarget = (initHashTarget / BigInt(Math.trunc(block.difficulty * 1000))) * 1000n;
  return hashTarget;
};

const PoolMiner = () => {
  const {
    tab,
    miningMode,
    setMiningMode,
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
  } = useContext(MinePageContext);

  const { headBlock } = useSelector(state => state.blockchain);
  const { params } = useSelector(state => state.consensus);

  const [successModal, setSuccessModal] = useState(false);
  const [poolInfo, setPoolInfo] = useState(null);

  const miningController = useRef(null);

  const getPoolInfo = async () => {
    const { data } = await axios.get("/pool/info");
    setPoolInfo(data);
  };

  useEffect(() => {
    getPoolInfo();
    return () => {
      miningController.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (miningMode !== "pool") {
      if (!miningController.current) return;
      // stop mining
      miningController.current.abort();
      miningController.current = null;
      setTerminalLogs(log => [...log, `\nMining operation stopped.`]);
    }
    if (miningMode === "pool") {
      startMining();
    }
  }, [miningMode]);

  useEffect(() => {
    if (!headBlock) return;
  }, [headBlock]);

  //   useEffect(() => {
  //     if (!isMining) return;
  //     if (isKeepMining) {
  //       startMining();
  //       return;
  //     }
  //     if (isAutoRestart && activeWorker.current) {
  //       console.log("new head block hash, restarting", headBlock.hash);
  //       activeWorker.current.terminate();
  //       activeWorker.current = null;
  //       setTerminalLogs(log => [...log, `\nNew head block found, mining operation restarting...`]);
  //       startMining();
  //     }
  //   }, [parentBlockHash]);

  const startMining = async () => {
    miningController.current = new AbortController();

    setTerminalLogs(log => [...log, "\nRequesting candidate block..."]);

    let response = null;
    try {
      response = await axios.get(`/pool/candidate-block/${miner}`, { signal: miningController.current.signal });
    } catch (error) {
      if (error.message === "canceled") return;
      setTerminalLogs(log => [...log, error.response?.data]);
      miningController.current = null;
      setMiningMode(null);
      return;
    }

    const { candidateBlock, shareDifficulty } = response.data;
    const target = calculateUnclampedHashTarget(params, { difficulty: shareDifficulty });

    setTerminalLogs(log => [
      ...log,
      `previous block: ${
        candidateBlock.previousHash
      }\nshare difficulty: ${shareDifficulty}\ntarget hash: ${bigIntToHex64(target)}\nMining started...`,
    ]);

    const worker = new Miner();
    worker.postMessage({ type: "pool", block: candidateBlock, target });
    worker.addEventListener("message", async ({ data }) => {
      switch (data.message) {
        case "nonce":
          setTerminalLogs(log => [...log, `nonce reached: ${data.block.nonce}`]);
          break;

        case "success":
          //   worker.terminate();
          //   miningController.current = null;

          setTerminalLogs(log => [...log, `\nSuccess! Share proof of work fulfilled with nonce: ${data.block.nonce}`]);

          const { validation, numSharesGranted } = (
            await axios.post(`/pool/block`, { nonce: data.block.nonce, hash: data.block.hash, miner })
          ).data;

          if (validation.code !== VCODE.VALID) {
            console.error("Block is invalid", data.block);
            miningController.current = null;
            setMiningMode(null);
            // setError(validation);
            // setErrorModal(true);
            break;
          }

          setTerminalLogs(log => [...log, `\nShares granted: ${numSharesGranted}`]);
          //   setMiningMode(null);

          break;
        default:
          console.error("invalid worker case");
      }
    });
    miningController.current.signal.addEventListener("abort", () => worker.terminate());
  };

  return (
    <section>
      <div className="mb-4">
        <h2 className="label mb-0">Pool Name</h2>
        <p className="is-size-7 mb-1">The name of the mining pool.</p>
        <p className="has-background-white px-3 py-1 has-text-black">{poolInfo?.poolName ?? "-"}</p>
      </div>
      <div className="mb-4">
        <h2 className="label mb-0">Pool Address</h2>
        <p className="is-size-7 mb-1">Address where all block rewards and fees go to, and is distributed from.</p>
        <p className="has-background-white px-3 py-1 has-text-black">{poolInfo?.poolAddress ?? "-"}</p>
      </div>
      <div className="mb-4">
        <h2 className="label mb-0">Pool Target Share Time</h2>
        <p className="is-size-7 mb-1">Desired time between each block submission that qualifies for shares.</p>
        <p className="has-background-white px-3 py-1 has-text-black">
          {poolInfo ? `${poolInfo.poolTargetShareTime} seconds` : "-"}
        </p>
      </div>

      <div className="field mb-4">
        <label className="label mb-0">Miner's address</label>
        <p className="is-size-7 mb-1">The address of the miner, where to send the pool's rewards.</p>

        <div className="field has-addons mb-5">
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

      <div className="has-text-right">
        <button
          onClick={() => (miningMode === "pool" ? setMiningMode(null) : setMiningMode("pool"))}
          className="button mb-0"
        >
          <i className="material-icons mr-2">memory</i>
          {miningMode === "pool" ? "Stop mining" : "Start mining"}
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

export default PoolMiner;
