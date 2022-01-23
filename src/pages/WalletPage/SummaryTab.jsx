import { useContext, useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import Loading from "../../components/Loading";
import "./index.css";

import { useMempool } from "../../hooks/useMempool";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

import Transaction from "../../components/Transaction";
import Pagination from "../../components/Pagination";

import { WalletContext } from "./WalletContext";

import { getMaxDecimalPlaces, numberWithCommas } from "../../helpers";
import axios from "axios";

const SummaryTab = () => {
  const [loadingMempool, mempool] = useMempool();

  const { externalKeys, internalKeys } = useSelector(state => state.wallet);
  const api = useSelector(state => state.network.api);

  const { walletInfo, params } = useContext(WalletContext);

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0); // 0 indexed page
  const transactionsSection = useRef(null);
  const transactionsPerPage = 10;
  const numFirstPages = 10;
  const numLastPages = 2;

  const { width } = useWindowDimensions();
  const isTablet = width > 769;

  const getWalletTransactions = async () => {
    setTransactions([]);
    const results = await axios.post(
      `${api}/address/transactions?limit=${transactionsPerPage}&offset=${page * transactionsPerPage}`,
      { addresses: [...externalKeys, ...internalKeys].map(key => key.addr) }
    );
    setTransactions(results.data);
  };

  useEffect(getWalletTransactions, [api, externalKeys, internalKeys, page]);

  const gotoPage = page => {
    transactionsSection.current?.scrollIntoView({ behavior: "smooth" });
    setPage(page);
  };

  if (loadingMempool)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  const { balance, totalReceived, totalSent, numUtxos, numTransactions, numBlocksMined } = walletInfo;

  const pending = mempool.filter(
    ({ inputs, outputs }) =>
      inputs.some(input => [...externalKeys, ...internalKeys].some(keys => keys.addr === input.address)) ||
      outputs.some(output => [...externalKeys, ...internalKeys].some(keys => keys.addr === output.address))
  );

  const decimalPlaces = isTablet
    ? 8
    : getMaxDecimalPlaces([balance / params.coin, totalReceived / params.coin, totalSent / params.coin]) + 1;

  const numPages = Math.ceil(numTransactions / transactionsPerPage);

  return (
    <main>
      <div className="-is-flex-tablet -is-align-items-start mb-6" style={{ gap: "2em" }}>
        <div className="card">
          <div
            className="card-content"
            style={{
              display: "grid",
              grid: "auto / auto auto",
              columnGap: "2em",
              rowGap: "1em",
              alignItems: "center",
            }}
          >
            <h3 className="title is-spaced is-6 mb-0">Balance: </h3>
            <p className="subtitle is-spaced is-size-2-tablet mb-0 has-text-weight-medium">
              {numberWithCommas((balance / params.coin).toFixed(decimalPlaces))}
              <span className="is-size-4-tablet"> {params.symbol}</span>
            </p>
            <h3 className="title is-spaced is-6 mb-0">Total received: </h3>
            <p className="subtitle is-spaced has-text-weight-medium is-6 mb-0">
              {numberWithCommas((totalReceived / params.coin).toFixed(decimalPlaces))} {params.symbol}
            </p>
            <h3 className="title is-spaced is-6 mb-0">Total sent: </h3>
            <p className="subtitle is-spaced has-text-weight-medium is-6 mb-0">
              {numberWithCommas((totalSent / params.coin).toFixed(decimalPlaces))} {params.symbol}
            </p>
            <h3 className="title is-spaced is-6 mb-0">UTXOs: </h3>
            <p className="subtitle is-spaced has-text-weight-medium is-6 mb-0">{numUtxos}</p>
            <h3 className="title is-spaced is-6 mb-0">Transactions: </h3>
            <p className="subtitle is-spaced has-text-weight-medium is-6 mb-0">{numTransactions}</p>
            <h3 className="title is-spaced is-6 mb-0">Blocks mined: </h3>
            <p className="subtitle is-spaced has-text-weight-medium is-6 mb-0">{numBlocksMined}</p>
            <h3 className="title is-spaced is-6 mb-0">Pending transactions:</h3>
            <p className="subtitle is-spaced has-text-weight-medium is-6 mb-0">{pending.length}</p>
          </div>
        </div>
      </div>
      <h1 className="title is-size-5 is-size-4-tablet mb-3">Pending transactions</h1>
      <div className="mb-6">
        {pending.length ? (
          pending.map(transaction => (
            <div key={transaction.hash} className="card mb-3">
              <div className="card-content">
                <Transaction transaction={transaction} />
              </div>
            </div>
          ))
        ) : (
          <main className="has-background-white is-flex is-justify-content-center" style={{ padding: "1.5em" }}>
            <span className="material-icons-outlined mr-3 md-18">pending_actions</span>
            <p className="subtitle is-6 has-text-centered">No pending transactions relating to your wallet...</p>
          </main>
        )}
      </div>

      <h1 ref={transactionsSection} className="title is-size-5 is-size-4-tablet mb-3">
        Transactions
      </h1>
      <div className="mb-6">
        {transactions.length ? (
          transactions.map(transaction => (
            <div key={transaction.hash} className="card mb-3">
              <div className="card-content">
                <Transaction transaction={transaction} />
              </div>
            </div>
          ))
        ) : (
          <div className="has-background-white py-4">
            <p className="subtitle is-6 has-text-centered">
              The address has not sent or received <span className="is-lowercase">{params.name}</span>s.
            </p>
          </div>
        )}
      </div>

      <Pagination currentPage={page} onPageChange={gotoPage} numPages={numPages} />
    </main>
  );
};

export default SummaryTab;
