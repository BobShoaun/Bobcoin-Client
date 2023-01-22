import { useState, useEffect, createContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Blockchain from "../../components/Blockchain/";
import MineMempool from "./MineMempool";
import MineFailureModal from "./MineFailureModal";
import Terminal from "./Terminal";
import Mempool from "../../components/Mempool";
import Loading from "../../components/Loading";
import SoloMiner from "./SoloMiner";
import PoolMiner from "./PoolMiner";

import "./mine.css";

export const MinePageContext = createContext();

const MinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { headBlock, mempool } = useSelector(state => state.blockchain);
  const { params } = useSelector(state => state.consensus);
  const { externalKeys, keys } = useSelector(state => state.wallet);

  const minerAddress = externalKeys[externalKeys.length - 1]?.address ?? keys.address ?? "";

  const [tab, setTab] = useState("solo");
  const [miningMode, setMiningMode] = useState(null);
  const [mineInfo, setMineInfo] = useState(null);
  const [miner, setMiner] = useState(minerAddress);

  const [terminalLogs, setTerminalLogs] = useState([]);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState({});

  // solo
  const [parentBlockHash, setParentBlockHash] = useState("");
  const [isAutoRestart, setIsAutoRestart] = useState(JSON.parse(localStorage.getItem("auto-remine")) ?? true);
  const [isKeepMiningSolo, setIsKeepMiningSolo] = useState(
    JSON.parse(localStorage.getItem("keep-mining-solo")) ?? false
  );
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  // pool
  const [isKeepMiningPool, setIsKeepMiningPool] = useState(
    JSON.parse(localStorage.getItem("keep-mining-pool")) ?? true
  );

  const getMineInfo = async () => {
    const { data } = await axios.get("/mine/info");
    setMineInfo(data);
  };

  useEffect(() => {
    getMineInfo();
  }, []);

  useEffect(() => {
    if (!mempool?.length) return;
    setSelectedTransactions([mempool[0]]);
  }, [mempool]);

  useEffect(() => {
    if (!location.hash) return navigate("#solo");
    setTab(location.hash.slice(1));
  }, [location, navigate]);

  useEffect(() => localStorage.setItem("auto-remine", isAutoRestart), [isAutoRestart]);
  useEffect(() => localStorage.setItem("keep-mining-solo", isKeepMiningSolo), [isKeepMiningSolo]);
  useEffect(() => localStorage.setItem("keep-mining-pool", isKeepMiningPool), [isKeepMiningPool]);

  const loading = !params || !headBlock;

  if (loading) return <Loading />;

  return (
    <MinePageContext.Provider
      value={{
        miningMode,
        setMiningMode,
        selectedTransactions,
        setSelectedTransactions,
        terminalLogs,
        setTerminalLogs,
        miner,
        setMiner,
        parentBlockHash,
        setParentBlockHash,
        isAutoRestart,
        setIsAutoRestart,
        isKeepMiningSolo,
        setIsKeepMiningSolo,
        isKeepMiningPool,
        setIsKeepMiningPool,
        setError,
        setErrorModal,
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

        <div className="is-flex-tablet mb-6" style={{ gap: "3em" }}>
          <Terminal />
          <section style={{ flexBasis: "35%" }}>
            <div className="tabs">
              <ul>
                <li onClick={() => setTab("solo")} className={tab === "solo" ? "is-active" : ""}>
                  <a href="#solo">
                    <span className="material-icons-two-tone mr-3">engineering</span>
                    <strong>Solo</strong>
                  </a>
                </li>
                <li onClick={() => setTab("pool")} className={tab === "pool" ? "is-active" : ""}>
                  <a href="#pool">
                    <span className="material-icons-two-tone mr-3">groups_2</span>
                    <strong>Pool</strong>
                  </a>
                </li>
              </ul>
            </div>

            <div style={{ display: tab === "solo" ? "block" : "none" }}>
              <SoloMiner />
            </div>
            <div style={{ display: tab === "pool" ? "block" : "none" }}>
              <PoolMiner />
            </div>
          </section>
        </div>

        {tab === "solo" ? (
          <>
            <div className="mb-4">
              <h3 className="title is-4">Mempool (Pending Transactions)</h3>
              <p className="subtitle is-6 ">Select transactions to include from the memory pool.</p>
            </div>

            <MineMempool
              selectedTransactions={selectedTransactions}
              toggleSelected={(value, tx) => {
                console.log("change ", value, tx);
                if (value) setSelectedTransactions(txs => [...txs, tx]);
                else setSelectedTransactions(txs => txs.filter(tx2 => tx2.hash !== tx.hash));
              }}
            />
          </>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="title is-4">Mempool (Pending Transactions)</h3>
              <p className="subtitle is-6 ">Transactions to include are selected by the pool operator.</p>
            </div>
            <Mempool />
          </>
        )}

        <MineFailureModal isOpen={errorModal} close={() => setErrorModal(false)} error={error} />
      </main>
    </MinePageContext.Provider>
  );
};

export default MinePage;
