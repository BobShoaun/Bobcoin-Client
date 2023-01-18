/* global BigInt */
import { useState, useEffect, useRef, useContext, createContext, useMemo } from "react";
import { useSelector } from "react-redux";
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
    isKeepMiningPool,
    setIsKeepMiningPool,
    miner,
    setTerminalLogs,
    setMiner,
    setError,
    setErrorModal,
  } = useContext(MinePageContext);

  const { headBlock } = useSelector(state => state.blockchain);
  const { params } = useSelector(state => state.consensus);
  const { apiToken } = useSelector(state => state.network);

  const [successModal, setSuccessModal] = useState(false);
  const [poolInfo, setPoolInfo] = useState(null);
  const [counter, setCounter] = useState(0);

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
    if (miningMode !== "pool") return;
    if (isKeepMiningPool) startMining();
  }, [counter]);

  useEffect(() => {
    if (!headBlock) return;
    if (miningController.current) {
      console.log("new head block hash, restarting", headBlock.hash);
      miningController.current.abort();
      miningController.current = null;
      setTerminalLogs(log => [...log, `\nNew head block found, mining operation restarting...`]);
      startMining();
    }
  }, [headBlock]);

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
          return;

        case "success":
          setTerminalLogs(log => [...log, `\nSuccess! Share proof of work fulfilled with nonce: ${data.block.nonce}`]);

          let response = null;
          try {
            response = await axios.post(
              `/pool/block`,
              { nonce: data.block.nonce, hash: data.block.hash, miner },
              { headers: { Authorization: `Bearer ${apiToken}` } } // TODO: remove once tested
            );
          } catch (error) {
            console.error("Block is invalid", error);
            miningController.current.abort();
            miningController.current = null;
            setMiningMode(null);
            return;
          }
          const { numSharesGranted, totalShares, isValid } = response.data;
          console.log(response.data);

          setTerminalLogs(log => [
            ...log,
            `\nShares granted: ${numSharesGranted}\nTotal shares: ${totalShares}\nBlock valid: ${isValid}`,
          ]);

          if (!isValid) setCounter(i => i + 1);
          if (isKeepMiningPool) return;

          setMiningMode(null);

          return;
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

      <div className="mb-5">
        <label className="checkbox is-flex" style={{ gap: ".5em" }}>
          <input type="checkbox" checked={isKeepMiningPool} onChange={e => setIsKeepMiningPool(e.target.checked)} />
          <div>
            <h3 className="label mb-0">Keep Mining</h3>
            <p className="is-size-7">Keep mining non-stop after receiving shares.</p>
          </div>
        </label>
      </div>

      <div className="has-text-right mb-5">
        <button
          onClick={() => setMiningMode(miningMode === "pool" ? null : "pool")}
          disabled={!apiToken} // TODO: remove once tested
          className="button mb-0"
        >
          <i className="material-icons mr-2">memory</i>
          {miningMode === "pool" ? "Stop mining" : "Start mining"}
        </button>
      </div>

      <details className="message is-info">
        <summary className="message-header is-clickable" style={{ display: "list-item", borderRadius: "4px" }}>
          Pool Info
        </summary>
        <div className="message-body has-background-light">
          <div className="mb-3">
            <h2 className="label mb-0">Pool Address</h2>
            <p className="is-size-7 mb-1 has-text-grey">
              Address where all block rewards and fees go to, and is distributed from.
            </p>
            <p className="has-background-white px-3 py-1 has-text-black">{poolInfo?.poolAddress ?? "-"}</p>
          </div>
          <div className="">
            <h2 className="label mb-0">Pool Target Share Time</h2>
            <p className="is-size-7 mb-1 has-text-grey">
              Desired time between each block submission that qualifies for shares.
            </p>
            <p className="has-background-white px-3 py-1 has-text-black">
              {poolInfo ? `${poolInfo.poolTargetShareTime} seconds` : "-"}
            </p>
          </div>
        </div>
      </details>

      <MineSuccessModal
        isOpen={successModal}
        close={() => setSuccessModal(false)}
        // blockReward={(calculateBlockReward(params, headBlock.height) / params.coin).toFixed(8)}
      />
    </section>
  );
};

export default PoolMiner;
