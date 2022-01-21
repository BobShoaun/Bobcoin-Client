import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";

import { useParams as useConsensus } from "../../hooks/useParams";

import Transaction from "../../components/Transaction";
import { copyToClipboard, numberWithCommas } from "../../helpers";
import Loading from "../../components/Loading";

import axios from "axios";

const TransactionPage = () => {
  const { hash } = useParams();
  const location = useLocation();
  const api = useSelector(state => state.network.api);

  const [loading, params] = useConsensus();

  const blockHash = new URLSearchParams(location.search).get("block");

  const [transaction, setTransaction] = useState(null);

  useEffect(async () => {
    setTransaction(null);
    const result = blockHash
      ? await axios.get(`${api}/transaction/info/${hash}?block=${blockHash}`)
      : await axios.get(`${api}/transaction/info/${hash}`);
    setTransaction(result.data);
  }, [api, hash, blockHash]);

  if (!transaction || loading)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  const totalInput = transaction.inputs.reduce((total, input) => total + input.amount, 0);
  const totalOutput = transaction.outputs.reduce((total, output) => total + output.amount, 0);
  const fee = totalInput - totalOutput;
  const isCoinbase = !transaction.inputs.length && transaction.outputs.length === 1;

  return (
    <section className="section">
      <h1 className="title is-size-4 is-size-2-tablet">Transaction</h1>
      <p className="subtitle is-size-6 is-size-5-tablet">A transaction in the mempool or blockchain.</p>
      <hr />

      <h1 className="title is-4">Summary</h1>

      <div className="card card-content has-background-white">
        <Transaction transaction={transaction} />
      </div>
      <hr />

      <h1 className="title is-4">Details</h1>

      <table className="table is-fullwidth mb-6">
        <tbody>
          <tr>
            <td>Hash</td>
            <td style={{ wordBreak: "break-all" }}>{transaction.hash}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td className="capitalize">{transaction.status}</td>
          </tr>
          <tr>
            <td>Confirmations</td>
            <td>{transaction.status === "orphaned" ? "-" : 0}</td>
          </tr>
          <tr>
            <td>Block Height</td>
            <td>{transaction.blockHeight ? transaction.blockHeight.toLocaleString() : "-"}</td>
          </tr>
          <tr>
            <td>Block Hash</td>
            <td style={{ wordBreak: "break-all" }}>
              {transaction.blockHash ? (
                <Link to={`../block/${transaction.blockHash}`}>{transaction.blockHash}</Link>
              ) : (
                "-"
              )}
            </td>
          </tr>

          <tr>
            <td>Version</td>
            <td>{transaction.version}</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>{new Date(transaction.timestamp).toUTCString()}</td>
          </tr>

          <tr>
            <td>Total Input Amount</td>
            <td>
              {numberWithCommas((totalInput / params.coin).toFixed(8))} {params.symbol}
            </td>
          </tr>
          <tr>
            <td>Total Output Amount</td>
            <td>
              {numberWithCommas((totalOutput / params.coin).toFixed(8))} {params.symbol}
            </td>
          </tr>
          <tr>
            <td>Fee</td>
            <td>{isCoinbase ? "-" : numberWithCommas((fee / params.coin).toFixed(8)) + " " + params.symbol}</td>
          </tr>
        </tbody>
      </table>

      <h1 className="title is-4">Inputs</h1>

      {isCoinbase && <p>No inputs for coinbase transaction</p>}

      <div className="mb-5">
        <table className="-table mb-5" style={{ width: "100%", borderSpacing: "10px" }}>
          <colgroup>
            <col span="1" style={{ width: "20%" }} />
            <col span="1" style={{ width: "80%" }} />
          </colgroup>
          <tbody>
            {transaction.inputs.map((input, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>Transaction Hash</td>
                  <td className="pl-3" style={{ wordBreak: "break-all" }}>
                    <Link to={`./${input.txHash}`}>{input.txHash}</Link>
                  </td>
                </tr>
                <tr>
                  <td>Output Index</td>
                  <td className="pl-3">{input.outIndex}</td>
                </tr>
                <tr>
                  <td>Public Key</td>
                  <td className="pl-3" style={{ wordBreak: "break-all" }}>
                    {input.publicKey}
                  </td>
                </tr>
                <tr>
                  <td>Signature</td>

                  <td
                    className="pb-5 pl-3"
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {input.signature}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <h1 className="title is-4">Outputs</h1>

      <div className="mb-6">
        <table className="mb-5" style={{ width: "100%", borderSpacing: "10px" }}>
          <colgroup>
            <col span="1" style={{ width: "20%" }} />
            <col span="1" style={{ width: "80%" }} />
          </colgroup>
          <tbody>
            {transaction.outputs.map((output, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>Index</td>
                  <td className="pl-3">{index}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td className="is-flex pl-3" style={{ wordBreak: "break-all" }}>
                    <Link to={`/address/${output.address}`}>{output.address}</Link>
                    <span
                      onClick={() => copyToClipboard(output.address, "Address copied")}
                      className="material-icons-outlined md-18 my-auto ml-2 is-clickable is-dark"
                    >
                      content_copy
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td className="pl-3 pb-5 has-text-weight-medium">
                    {(output.amount / params.coin).toFixed(8)} {params.symbol}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionPage;
