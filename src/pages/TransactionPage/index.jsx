import { useState, useEffect, Fragment, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";

import Transaction from "../../components/Transaction";
import { copyToClipboard, numberWithCommas, getTransactionStatus } from "../../helpers";
import Loading from "../../components/Loading";

import axios from "axios";
import { format } from "date-fns";
import { getTransactionSize } from "blockcrypto";

const TransactionPage = () => {
  const { hash } = useParams();
  const location = useLocation();

  const [transaction, setTransaction] = useState(null);
  const { params } = useSelector(state => state.consensus);
  const { headBlock } = useSelector(state => state.blockchain);

  const blockHash = new URLSearchParams(location.search).get("block");

  const getTransaction = useCallback(async () => {
    setTransaction(null);
    const { data } = blockHash
      ? await axios.get(`/transaction/${hash}?block=${blockHash}`)
      : await axios.get(`/transaction/${hash}`);
    setTransaction(data);
  }, [hash, blockHash]);

  useEffect(getTransaction, [getTransaction]);

  if (!transaction || !params || !headBlock) return <Loading />;

  const totalInput = transaction.inputs.reduce((total, input) => total + input.amount, 0);
  const totalOutput = transaction.outputs.reduce((total, output) => total + output.amount, 0);
  const fee = totalInput - totalOutput;
  const isCoinbase = !transaction.inputs.length;
  const confirmations = transaction.block ? headBlock.height - transaction.block.height + 1 : 0;

  const status = getTransactionStatus(transaction, headBlock, params);

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

      <table className="table is-fullwidth mb-6 info-table">
        <tbody>
          <tr>
            <td>Hash</td>
            <td style={{ wordBreak: "break-all" }}>{transaction.hash}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
              <span
                style={{ borderRadius: "0.3em" }}
                className={`title is-7 py-1 px-2 has-background-success has-text-white capitalize ${status.colorClass}`}
              >
                {status.text}
              </span>
            </td>
          </tr>
          <tr>
            <td>Confirmations</td>
            <td>{transaction.block?.valid ? confirmations : 0}</td>
          </tr>
          <tr>
            <td>Block Height</td>
            <td>{isNaN(transaction.block?.height) ? "-" : transaction.block.height.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Block Hash</td>
            <td style={{ wordBreak: "break-all" }}>
              {transaction.block?.hash ? (
                <Link to={`../block/${transaction.block.hash}`}>{transaction.block.hash}</Link>
              ) : (
                "-"
              )}
            </td>
          </tr>
          <tr>
            <td>Message</td>
            <td style={{ wordBreak: "break-word" }}>{transaction.message ?? "-"}</td>
          </tr>

          <tr>
            <td>Version</td>
            <td>{transaction.version}</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>{format(transaction.timestamp, "eee, d MMM yyy HH:mm:ss OOO")}</td>
          </tr>
          <tr>
            <td>Size</td>
            <td>{getTransactionSize(transaction)} bytes</td>
          </tr>

          <tr>
            <td>Total Input</td>
            <td>
              {numberWithCommas((totalInput / params.coin).toFixed(8))} {params.symbol}
            </td>
          </tr>
          <tr>
            <td>Total Output</td>
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

      <div className="mb-5 ml-2">
        <table className="-table mb-5" style={{ width: "100%", borderSpacing: "10px" }}>
          <colgroup>
            <col span="1" style={{ width: "20%" }} />
            <col span="1" style={{ width: "80%" }} />
          </colgroup>
          <tbody>
            {transaction.inputs.map((input, index) => (
              <Fragment key={index}>
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
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <h1 className="title is-4">Outputs</h1>

      <div className="mb-6 ml-2">
        <table className="-table mb-5" style={{ width: "100%", borderSpacing: "10px" }}>
          <colgroup>
            <col span="1" style={{ width: "20%" }} />
            <col span="1" style={{ width: "80%" }} />
          </colgroup>
          <tbody>
            {transaction.outputs.map((output, index) => (
              <Fragment key={index}>
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
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionPage;
