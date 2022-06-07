import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import ReactTooltip from "react-tooltip";
import { format } from "date-fns";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

import { getMaxDecimalPlaces, numberWithCommas, getTransactionStatus } from "../helpers";

const Transaction = ({ transaction }) => {
  const { headBlock } = useSelector(state => state.blockchain);
  const { params } = useSelector(state => state.consensus);

  const totalInput = transaction.inputs.reduce((total, input) => total + input.amount, 0);
  const totalOutput = transaction.outputs.reduce((total, output) => total + output.amount, 0);
  const isCoinbase = transaction.inputs.length === 0 && transaction.outputs.length === 1;
  const fee = totalInput - totalOutput;
  const status = getTransactionStatus(transaction, headBlock, params);

  const { width } = useWindowDimensions();
  const isTablet = width > 769;

  const decimalPlaces = isTablet
    ? 8
    : getMaxDecimalPlaces([
        totalInput / params.coin,
        totalOutput / params.coin,
        fee / params.coin,
        ...transaction.inputs.map(input => input.amount / params.coin),
        ...transaction.outputs.map(output => output.amount / params.coin),
      ]) + 1;

  return (
    <div className="">
      <div className="is-flex-tablet is-align-items-center mb-3">
        <div className="is-flex is-align-items-center">
          <h3 className="title is-6 mb-0 mr-1" style={{ whiteSpace: "nowrap" }}>
            Hash:
          </h3>
          <Link
            className="is-block truncated"
            to={
              transaction.block?.hash
                ? `/transaction/${transaction.hash}?block=${transaction.block.hash}`
                : `/transaction/${transaction.hash}`
            }
          >
            {transaction.hash ?? "-"}
          </Link>
        </div>

        <p style={{ flexShrink: 0 }} className="ml-auto pl-2 subtitle is-6 mb-0 has-text-right">
          {format(transaction.timestamp, "HH:mm d MMM yyyy")}
        </p>
      </div>

      <section className="is-flex-tablet mb-3" style={{ gap: "2em" }}>
        {isCoinbase ? (
          <p style={{ flex: "1" }}>COINBASE (Newly Minted Coins)</p>
        ) : (
          <div className="is-flex truncated" style={{ flex: "1" }}>
            <div className="truncated">
              {transaction.inputs.map((input, index) => (
                <Link key={index} className="is-block truncated" to={`/address/${input.address}`}>
                  {input.address}
                </Link>
              ))}
            </div>

            <div className="ml-auto pl-2" style={{ whiteSpace: "nowrap" }}>
              {transaction.inputs.map((input, index) => (
                <div key={index} className="is-flex is-align-items-center is-justify-content-flex-end">
                  <p key={index} className="has-text-weight-medium has-text-right">
                    {numberWithCommas((input.amount / params.coin).toFixed(decimalPlaces))} {params.symbol}
                  </p>
                  <div data-tip data-for="tx-out" className="is-block ml-3">
                    <Link className="is-block truncated" to={`/transaction/${input.txHash}`}>
                      <span className="has-text-info material-icons-outlined md-18 is-block my-auto">credit_score</span>
                    </Link>
                    <ReactTooltip id="tx-out" type="info" effect="solid">
                      <span>Tx output</span>
                    </ReactTooltip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <i className="material-icons md-28" style={{ lineHeight: "24px" }}>
            arrow_right_alt
          </i>
        </div>

        <div className="is-flex  truncated" style={{ flex: "1" }}>
          <div className="truncated">
            {transaction.outputs.map((output, index) => (
              <Link key={index} className="is-block truncated" to={`/address/${output.address}`}>
                {output.address}
              </Link>
            ))}
          </div>
          <div className="ml-auto pl-2" style={{ whiteSpace: "nowrap" }}>
            {transaction.outputs.map((output, index) => (
              <div key={index} className="is-flex is-align-items-center is-justify-content-flex-end">
                <p className="has-text-weight-medium has-text-right">
                  {numberWithCommas((output.amount / params.coin).toFixed(decimalPlaces))} {params.symbol}
                </p>
                {!transaction.block?.valid ? (
                  <div data-tip data-for="spent" className="is-block ml-3">
                    <span className="has-text-grey material-icons-outlined md-18 is-block my-auto">credit_card</span>
                    <ReactTooltip id="spent" type="dark" effect="solid">
                      <span>Unspendable Output</span>
                    </ReactTooltip>
                  </div>
                ) : output.txHash ? (
                  <div data-tip data-for="spent" className="is-block ml-3">
                    <Link className="is-block truncated" to={`/transaction/${output.txHash}`}>
                      <span className="has-text-danger material-icons-outlined md-18 is-block my-auto">
                        credit_card_off
                      </span>
                    </Link>

                    <ReactTooltip id="spent" type="error" effect="solid">
                      <span>Spent output</span>
                    </ReactTooltip>
                  </div>
                ) : (
                  <a data-tip data-for="unspent" className="ml-3 is-block">
                    <span className="has-text-success material-icons-outlined md-18 is-block my-auto">credit_card</span>
                    <ReactTooltip id="unspent" type="dark" effect="solid">
                      <span>Unspent output</span>
                    </ReactTooltip>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="is-flex is-flex-wrap-wrap" style={{ gap: "1em" }}>
        <div className="mt-auto">
          <span
            className={`subtitle is-inline-block py-1 px-3 has-text-white has-text-weight-medium ${status.colorClass}`}
            style={{ borderRadius: "0.3em", fontSize: ".9rem" }}
          >
            {status.text}
          </span>
        </div>
        <div className="has-text-right ml-auto">
          <span
            className="is-inline-block subtitle is-6 px-3 py-1 mb-0 has-background-dark has-text-white has-text-weight-medium"
            style={{ borderRadius: "0.3em", fpaddingBlock: ".1em" }}
          >
            Amount = {numberWithCommas((totalOutput / params.coin).toFixed(decimalPlaces))} {params.symbol}
          </span>
          {!isCoinbase && (
            <div>
              <span
                className="is-inline-block subtitle is-6 px-3 py-1 mt-1 has-text-dark has-text-weight-medium"
                style={{ background: "lightgray", borderRadius: "0.3em", paddingBlock: ".1em" }}
              >
                Fee = {numberWithCommas((fee / params.coin).toFixed(decimalPlaces))} {params.symbol}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Transaction;
