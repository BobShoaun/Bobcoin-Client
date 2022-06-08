import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Blockchain from "../../components/Blockchain/";
import Mempool from "../../components/Mempool";
import Loading from "../../components/Loading";
import Transaction from "../../components/Transaction";
import Pagination from "../../components/Pagination";
import axios from "axios";
import useDidUpdateEffect from "../../hooks/useUpdateEffect";

import "./index.css";

const OverviewPage = () => {
  const { params, paramsLoaded } = useSelector(state => state.consensus);
  const { mempool, mempoolLoaded } = useSelector(state => state.blockchain);

  const [transactions, setTransactions] = useState([]);
  const [numTxPages, setNumTxPages] = useState(0);
  const [txPage, setTxPage] = useState(0); // 0 indexed page\

  const transactionsSection = useRef(null);
  const transactionsPerPage = 10;

  const [mempoolTxs, setMempoolTxs] = useState([]);
  const [numMempoolPages, setNumMempoolPages] = useState(0);
  const [mempoolPage, setMempoolPage] = useState(0);
  const mempoolTxsPerPage = 10;

  const getTransactionCount = async () => {
    const { data } = await axios.get(`/transactions/count`);
    setNumTxPages(Math.ceil(data.count / transactionsPerPage));
  };

  const getTransactions = async () => {
    const { data } = await axios.get(
      `/transactions?limit=${transactionsPerPage}&offset=${txPage * transactionsPerPage}`
    );
    setTransactions(data);
  };

  const getMempoolTxCount = async () => {
    const { data } = await axios.get("/mempool/count");
    setNumMempoolPages(Math.ceil(data.count / mempoolTxsPerPage));
  };

  const getMempoolTxs = async () => {
    setMempoolTxs([]);
    const { data } = await axios.get(
      `/mempool/all?limit=${mempoolTxsPerPage}&offset=${mempoolPage * mempoolTxsPerPage}`
    );
    setMempoolTxs(data);
  };

  useEffect(getTransactionCount, []);
  useEffect(getTransactions, [txPage]);
  useEffect(getMempoolTxCount, []);
  useEffect(getMempoolTxs, [mempoolPage]);

  useDidUpdateEffect(
    () =>
      (async () => {
        await getTransactions();
        transactionsSection.current?.scrollIntoView({ behavior: "smooth" });
      })(),
    [txPage]
  );

  if (!paramsLoaded || !mempoolLoaded)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  return (
    <section className="section">
      <div className="is-flex-tablet">
        <div className="mb-3">
          <h1 className="title is-size-4 is-size-2-tablet mb-1">Overview</h1>
          <div className="is-flex">
            <span className="material-icons mr-2 my-auto ticker">monetization_on</span>
            <h2 className="subtitle is-size-5 is-size-4-tablet">
              {params.name} {params.symbol}
            </h2>
          </div>
        </div>
        <div className="ml-auto field mb-4" style={{ minWidth: "15em" }}>
          <p className="control has-icons-left">
            <input className="input" type="search" placeholder="Search" />
            <span className="icon is-left is-small">
              <i className="material-icons">search</i>
            </span>
          </p>
        </div>
      </div>
      <hr className="mb-6 mt-3 has-background-grey-light" />

      <div className="is-flex is-flex-wrap-wrap mb-3" style={{ gap: ".5em" }}>
        <div>
          <h2 className="title is-size-5 is-size-4-tablet">Blocks - Recently mined</h2>
          <p className="subtitle is-size-6">Most recently mined blocks in the blockchain.</p>
        </div>
        <Link to="./blockchain" className="button is-secondary ml-auto has-text-weight-semibold">
          <span className="material-icons mr-2">view_in_ar</span>
          <span>View all Blocks</span>
        </Link>
      </div>
      <div className="mb-6" style={{ overflow: "auto" }}>
        <Blockchain />
      </div>

      <div className="is-flex is-flex-wrap-wrap mb-4" style={{ gap: ".5em" }}>
        <div>
          <h2 className="title is-size-5 is-size-4-tablet">Pending Transactions (Mempool)</h2>
          <p className="subtitle is-size-6">All unconfirmed transactions that are waiting to be put into blocks.</p>
        </div>
        <Link to="/transaction/create" className="button is-secondary ml-auto has-text-weight-semibold">
          <span className="material-icons mr-2">send</span>
          <span>Make Transaction</span>
        </Link>
      </div>
      <div className="mb-6">
        {mempool.length ? (
          mempool.map(transaction => (
            <div key={transaction.hash} className="card mb-2">
              <div className="card-content">
                <Transaction transaction={transaction} />
              </div>
            </div>
          ))
        ) : (
          <main className="has-background-white mb-6 is-flex is-justify-content-center" style={{ padding: "2.5em" }}>
            <span className="material-icons-outlined mr-3 md-18">pending_actions</span>
            <p className="subtitle is-6 has-text-centered">There are currently no pending transactions...</p>
          </main>
        )}
      </div>

      <div ref={transactionsSection} className="mb-4" style={{ gap: ".5em", scrollMargin: "5rem" }}>
        <h2 className="title is-size-5 is-size-4-tablet">Confirmed Transactions</h2>
        <p className="subtitle is-size-6">All recently confirmed transactions on the blockchain.</p>
      </div>
      <div className="mb-6">
        {transactions.length ? (
          transactions.slice(0, 20).map(transaction => (
            <div key={transaction.hash} className="card mb-3">
              <div className="card-content">
                <Transaction transaction={transaction} />
              </div>
            </div>
          ))
        ) : (
          <div className="has-background-white py-4">
            <p className="subtitle is-6 has-text-centered">Looks like there are no transactions recently!</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <Pagination currentPage={txPage} onPageChange={setTxPage} numPages={numTxPages} />
      </div>
    </section>
  );
};

export default OverviewPage;
