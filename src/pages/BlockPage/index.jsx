import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";

import Transaction from "../../components/Transaction";

import { copyToClipboard, numberWithCommas } from "../../helpers";
import Loading from "../../components/Loading";

import { bigIntToHex64, calculateHashTarget, calculateBlockReward } from "blockcrypto";

import axios from "axios";

const BlockPage = () => {
  const { hash, height } = useParams();
  const history = useHistory();
  const { params, paramsLoaded } = useSelector(state => state.consensus);
  const { headBlock, headBlockLoaded } = useSelector(state => state.blockchain);

  const [block, setBlock] = useState(null);

  const getBlockByHash = async () => {
    if (!hash) return;
    setBlock(null);
    const { data } = await axios.get(`/block/${hash}`);
    setBlock(data);
  };
  useEffect(getBlockByHash, [hash]);

  const getBlocksByHeight = async () => {
    if (!height) return;
    setBlock(null);
    const { data } = await axios.get(`/blocks/height/${height}`);
    setBlock(data[0]);
  };
  useEffect(getBlocksByHeight, [height]);

  if (!block || !paramsLoaded || !headBlockLoaded)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  const getStatus = block => {
    // TODO: common code in blockpage
    if (!block.valid) return { type: "Orphaned", color: "has-background-danger" };
    if (block.height >= headBlock.height - 6) return { type: "Unconfirmed", color: "has-background-warning" };
    return { type: "Confirmed", color: "has-background-success" };
  };

  const confirmations = block.valid ? headBlock.height - block.height + 1 : 0;
  const totalInput = block.transactions
    .slice(1)
    .reduce((total, info) => total + info.inputs.reduce((total, input) => total + input.amount, 0), 0);
  const totalOutput = block.transactions
    .slice(1)
    .reduce((total, info) => total + info.outputs.reduce((total, output) => total + output.amount, 0), 0);

  // const status = getStatus(block);

  return (
    <section className="section">
      <div className="is-flex is-align-items-center mb-5">
        <h1 className="title is-size-4 is-size-2-tablet mb-0">Block #{block.height}</h1>
        <div className="has-text-right ml-auto">
          <button
            title="Previous block"
            className="button is-link"
            onClick={() => history.push(`/block/${block.previousHash}`)}
            disabled={!block.previousHash}
          >
            <span className="material-icons-two-tone">arrow_back</span>
          </button>
          <button
            title="Next block"
            onClick={() => history.push(`/block/height/${block.height + 1}`)}
            className="button is-link ml-3"
            disabled={block.height >= headBlock.height}
          >
            <span className="material-icons-two-tone">arrow_forward</span>
          </button>
        </div>
      </div>

      <table className="table is-fullwidth mb-6">
        <tbody>
          <tr>
            <td>Hash</td>
            <td className="is-flex is-align-items-center" style={{ wordBreak: "break-all" }}>
              {block.hash}
              <button
                onClick={() => copyToClipboard(block.hash, "Block hash copied")}
                className="material-icons-outlined md-14 ml-1 highlight-button py-0"
              >
                content_copy
              </button>
            </td>
          </tr>
          <tr>
            <td>Height</td>
            <td>
              {numberWithCommas(block.height)} {block.height === 0 && "(Genesis)"}
            </td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>{new Date(block.timestamp).toUTCString()}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
              <span
                style={{ borderRadius: "0.3em" }}
                className={`title is-7 py-1 px-2 has-text-white capitalize confirmations-${Math.min(
                  confirmations,
                  params.blkMaturity
                )}`}
              >
                {confirmations > 0 ? `${confirmations.toLocaleString()} Confirmations` : "Orphaned"}
              </span>
            </td>
          </tr>
          <tr>
            <td>Version</td>
            <td>{block.version}</td>
          </tr>
          {/* <tr>
            <td>Confirmations</td>
            <td>{block.valid ? confirmations : "-"}</td>
          </tr> */}
          <tr>
            <td>Miner</td>
            <td style={{ wordBreak: "break-all" }}>
              <div className="is-flex">
                <Link to={`/address/${block.transactions[0].outputs[0].address}`}>
                  {block.transactions[0].outputs[0].address}
                </Link>
                <span
                  onClick={() => copyToClipboard(block.transactions[0].outputs[0].address, "Address copied")}
                  className="material-icons-outlined md-18 my-auto ml-2 is-clickable"
                  style={{ color: "lightgray" }}
                >
                  content_copy
                </span>
              </div>
            </td>
          </tr>

          <tr>
            <td>Difficulty</td>
            <td>{parseFloat(block.difficulty).toFixed(4)}</td>
          </tr>
          <tr>
            <td>Target Hash</td>
            <td fclassName="is-family-monospace" style={{ wordBreak: "break-all" }}>
              {bigIntToHex64(calculateHashTarget(params, block))}
            </td>
          </tr>
          <tr>
            <td>Nonce</td>
            <td>{numberWithCommas(block.nonce)}</td>
          </tr>
          <tr>
            <td>Previous block</td>
            <td style={{ wordBreak: "break-all" }}>
              {block.previousHash ? <Link to={`/block/${block.previousHash}`}>{block.previousHash}</Link> : "-"}
            </td>
          </tr>
          <tr>
            <td>Number of Transactions</td>
            <td>{block.transactions.length}</td>
          </tr>
          <tr>
            <td>Merkle Root</td>
            <td fclassName="is-family-monospace" style={{ wordBreak: "break-all" }}>
              {block.merkleRoot}
            </td>
          </tr>
          <tr>
            <td>Total transacted amount</td>
            <td>
              {numberWithCommas((totalInput / params.coin).toFixed(8))} {params.symbol}
            </td>
          </tr>
          <tr>
            <td>Block reward</td>
            <td>
              {numberWithCommas((calculateBlockReward(params, block.height) / params.coin).toFixed(8))} {params.symbol}
            </td>
          </tr>
          <tr>
            <td>Total Fees</td>
            <td>
              {numberWithCommas(((totalInput - totalOutput) / params.coin).toFixed(8))} {params.symbol}
            </td>
          </tr>
        </tbody>
      </table>
      <h2 className="title is-4">Transactions in this block</h2>
      <div className="mb-5">
        {block.transactions.length &&
          block.transactions.map(transaction => {
            transaction.block = { height: block.height, hash: block.hash, valid: block.valid };
            return (
              <div key={transaction.hash} className="card mb-3">
                <div className="card-content">
                  <Transaction transaction={transaction}></Transaction>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default BlockPage;
