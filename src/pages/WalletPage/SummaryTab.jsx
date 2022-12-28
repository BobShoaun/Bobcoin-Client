import { useContext, useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import { useWindowDimensions } from "../../hooks/useWindowDimensions";

import Transaction from "../../components/Transaction";
import Pagination from "../../components/Pagination";

import { WalletContext } from ".";
import useDidUpdateEffect from "../../hooks/useUpdateEffect";

import { getMaxDecimalPlaces, numberWithCommas } from "../../helpers";
import axios from "axios";

const SummaryTab = () => {
  const { externalKeys, internalKeys } = useSelector(state => state.wallet);
  const { mempool } = useSelector(state => state.blockchain);
  const { walletInfo, params } = useContext(WalletContext);

  const [transactions, setTransactions] = useState([]);
  const [mempoolTxs, setMempoolTxs] = useState([]);
  const [page, setPage] = useState(0); // 0 indexed page
  const transactionsSection = useRef(null);
  const transactionsPerPage = 10;

  const { width } = useWindowDimensions();
  const isTablet = width > 769;
  const addresses = useMemo(
    () => [...externalKeys, ...internalKeys].map(key => key.address),
    [externalKeys, internalKeys]
  );

  const getWalletTransactions = async () => {
    if (!addresses.length) return;
    const { data } = await axios.post(
      `/wallet/transactions?limit=${transactionsPerPage}&offset=${page * transactionsPerPage}`,
      addresses
    );
    setTransactions(data);
  };

  useEffect(getWalletTransactions, [addresses, page]);
  useDidUpdateEffect(
    () =>
      (async () => {
        await getWalletTransactions();
        transactionsSection.current?.scrollIntoView({ behavior: "smooth" });
      })(),
    [addresses, page]
  );

  const getMempoolTransactions = async () => {
    if (!addresses.length) return;
    setMempoolTxs([]);
    const results = await axios.post(`/wallet/mempool`, addresses);
    setMempoolTxs(results.data);
  };
  useEffect(getMempoolTransactions, [addresses, page]);

  const { balance, totalReceived, totalSent, numUtxos, numTransactions, numBlocksMined } = walletInfo;

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
              grid: "auto / 1fr 2fr",
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
            <p className="subtitle is-spaced has-text-weight-medium is-6 mb-0">{mempoolTxs.length}</p>
          </div>
        </div>
      </div>
      <h1 className="title is-size-5 is-size-4-tablet mb-3">Pending transactions</h1>
      <div className="mb-6">
        {mempoolTxs.length ? (
          mempoolTxs.map(transaction => (
            <div key={transaction.hash} className="card mb-3">
              <div className="card-content">
                <Transaction transaction={transaction} />
              </div>
            </div>
          ))
        ) : (
          <main className="has-background-white is-flex is-justify-content-center" style={{ padding: "1.5em" }}>
            <span className="material-icons-outlined mr-3 md-18">pending_actions</span>
            <p className="subtitle is-6 has-text-centered">No pending transactions at the moment...</p>
          </main>
        )}
      </div>

      <h1 ref={transactionsSection} style={{ scrollMargin: "5rem" }} className="title is-size-5 is-size-4-tablet mb-3">
        Confirmed transactions
      </h1>
      <div className="mb-5">
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
            <p className="subtitle is-6 has-text-centered">No confirmed transactions related to your wallet...</p>
          </div>
        )}
      </div>

      <Pagination currentPage={page} onPageChange={setPage} numPages={numPages} />
    </main>
  );
};

export default SummaryTab;
