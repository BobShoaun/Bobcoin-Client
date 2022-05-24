import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import QRCode from "qrcode";
import { copyToClipboard, numberWithCommas } from "../../helpers";

import Transaction from "../../components/Transaction";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

import { isAddressValid } from "blockcrypto";
import axios from "axios";
import ReactTooltip from "react-tooltip";

const AddressPage = ({ match }) => {
  const { address } = useParams();
  const history = useHistory();
  const searchInput = useRef();
  const [addressQR, setAddressQR] = useState("");

  const api = useSelector(state => state.network.api);
  const { params, paramsLoaded } = useSelector(state => state.consensus);

  const [addressInfo, setAddressInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0); // 0 indexed page
  const transactionsSection = useRef(null);
  const transactionsPerPage = 10;
  const numFirstPages = 10;
  const numLastPages = 2;

  const getAddressInfo = async () => {
    setAddressInfo(null);
    const results = await axios.get(`/address/${address}/info`);
    setAddressInfo(results.data);
  };

  const getAddressTransactions = async () => {
    setTransactions([]);
    const results = await axios.get(
      `${api}/address/${address}/transactions?limit=${transactionsPerPage}&offset=${page * transactionsPerPage}`
    );
    setTransactions(results.data);
  };

  useEffect(() => setPage(0), [match.params.address]);
  useEffect(getAddressInfo, [api, address]);
  useEffect(getAddressTransactions, [api, address, page]);

  useEffect(() => {
    QRCode.toString(address).then(setAddressQR);
  }, [address]);

  const handleSearch = event => {
    event.preventDefault();
    history.push(`./${searchInput.current.value}`);
  };

  const gotoPage = page => {
    transactionsSection.current?.scrollIntoView({ behavior: "smooth" });
    setPage(page);
  };

  if (!addressInfo || !paramsLoaded)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  const { balance, totalReceived, totalSent, numUtxos, numTransactions, numBlocksMined } = addressInfo;
  const isValid = isAddressValid(params, address);
  const numPages = Math.ceil(numTransactions / transactionsPerPage);

  return (
    <section className="section">
      <div className="is-flex-tablet is-align-items-center mb-5">
        <div className="">
          <h1 className="title is-size-4 is-size-2-tablet">Address</h1>
          <p className="subtitle is-size-6 is-size-5-tablet mb-3">
            See this address's balance, transaction history, and more.
          </p>
        </div>
        <form onSubmit={handleSearch} className="ml-auto" style={{ minWidth: "20em" }}>
          <p className="control has-icons-left">
            <input ref={searchInput} className="input" type="search" placeholder="Search for an address" />
            <span className="icon is-left is-small">
              <i className="material-icons">search</i>
            </span>
          </p>
        </form>
      </div>
      <div className="is-flex-tablet is-align-items-center mb-6" style={{ gap: "2em" }}>
        <p dangerouslySetInnerHTML={{ __html: addressQR }} className="m-5 box" style={{ flexBasis: "22em" }}></p>
        <table className="table is-fullwidth">
          <tbody>
            <tr>
              <td>Address</td>
              <td>
                <div className="is-flex" style={{ wordBreak: "break-all" }}>
                  {address}
                  <button
                    onClick={() => copyToClipboard(address, "Address copied")}
                    className="material-icons-outlined md-14 my-auto ml-1 highlight-button py-0"
                  >
                    content_copy
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="is-flex is-align-items-center">
                  <span>Valid?</span>
                  <div data-tip data-for="valid" className="is-block ml-2">
                    <span className="has-text-info material-icons-outlined md-14 is-block my-auto">info</span>
                    <ReactTooltip id="valid" type="dark" effect="solid">
                      <span>whether checksum in address is fulfilled</span>
                    </ReactTooltip>
                  </div>
                </div>
              </td>
              <td>
                {isValid ? (
                  <i className="has-text-success material-icons md-20 mb-0">check_circle_outline</i>
                ) : (
                  <i className="has-text-danger material-icons md-20">dangerous</i>
                )}
              </td>
            </tr>
            <tr>
              <td>Transactions</td>
              <td>{numTransactions}</td>
            </tr>
            <tr>
              <td>UTXOs</td>
              <td>{numUtxos}</td>
            </tr>
            <tr>
              <td>Blocks mined</td>
              <td>{numBlocksMined}</td>
            </tr>
            <tr>
              <td>
                <div className="is-flex is-align-items-center">
                  <span>Total Received</span>
                  <div data-tip data-for="total-received" className="is-block ml-2">
                    <span className="has-text-info material-icons-outlined md-14 is-block my-auto">info</span>
                    <ReactTooltip id="total-received" type="dark" effect="solid">
                      <span>total output amount to address</span>
                    </ReactTooltip>
                  </div>
                </div>
              </td>
              <td>
                {numberWithCommas((totalReceived / params.coin).toFixed(8))} {params.symbol}
              </td>
            </tr>
            <tr>
              <td>
                <div className="is-flex is-align-items-center">
                  <span>Total Sent</span>
                  <div data-tip data-for="total-sent" className="is-block ml-2">
                    <span className="has-text-info material-icons-outlined md-14 is-block my-auto">info</span>
                    <ReactTooltip id="total-sent" type="dark" effect="solid">
                      <span>total input amount to address</span>
                    </ReactTooltip>
                  </div>
                </div>
              </td>
              <td>
                {numberWithCommas((totalSent / params.coin).toFixed(8))} {params.symbol}
              </td>
            </tr>
            <tr>
              <td>Final Balance</td>
              <td className="has-text-weight-semibold">
                {numberWithCommas((balance / params.coin).toFixed(8))} {params.symbol}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h1 ref={transactionsSection} className="title is-size-5 is-size-4-tablet">
        Transactions
      </h1>
      <p className="subtitle is-size-6">Confirmed transactions this address is involved.</p>
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
    </section>
  );
};

export default AddressPage;
