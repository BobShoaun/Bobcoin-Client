import { useRef, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { copyToClipboard } from "../../helpers";

import { format } from "date-fns";

import "./block.css";

const Block = ({ block, selected, blockchainRef, onChange, rerender }) => {
  const [isExpanded, setIsExpanded] = useState(block.valid);
  const [connector, setConnector] = useState(null);
  const rightHook = useRef(null);

  useLayoutEffect(() => {
    if (!blockchainRef.current) return;
    if (!rightHook.current) return;

    const prevBlockPos = blockchainRef.current
      .querySelector(`[data-left-hook][data-block-hash='${block.previousHash}']`)
      ?.getBoundingClientRect();

    if (!prevBlockPos) return;

    const rect = rightHook.current.getBoundingClientRect();
    const width = Math.sqrt(Math.pow(rect?.x - prevBlockPos.x, 2) + Math.pow(rect?.y - prevBlockPos.y, 2));
    const angle = Math.atan((rect.y - prevBlockPos.y) / (rect.x - prevBlockPos.x));

    setConnector({ width, angle });
  }, [rightHook.current, blockchainRef.current, rerender]);

  const setExpanded = value => {
    setIsExpanded(value);
    onChange?.();
  };

  return (
    <div className={`card is-flex is-flex-direction-column h-100 block ${selected ? "block-selected" : ""}`}>
      <div className="card-header" style={{ borderRadius: 0 }}>
        <div className="card-header-title" style={{ position: "relative" }}>
          <div className="block-hook has-background-info" data-block-hash={block.hash} data-left-hook></div>

          <h1 className="subtitle mb-0 is-6 truncated is-family-monospace mx-auto" style={{ maxWidth: "14ch" }}>
            {/* {block.hash} */}
            <Link className="has-text-info" to={`/block/${block.hash}`}>
              {block.hash}
            </Link>
          </h1>
          {/* {block.height === 0 && <span className="subtitle is-6 mb-0"> (Genesis)</span>} */}
          {/* <p className="subtitle is-7 is-spaced mb-4 truncated">
            <Link to={`/block/${block.hash}`}>{block.hash}</Link>
          </p> */}

          {/* {selected && (
            <span
              className="has-background-link has-text-white has-text-weight-medium px-2 ml-2"
              style={{ fontSize: ".75rem", borderRadius: "2rem" }}
            >
              Head
            </span>
          )} */}
          <div ref={rightHook} className="block-hook has-background-info">
            {block.height > 0 && (
              <div className="block-connector">
                <div
                  style={{
                    width: connector?.width ?? "3em",
                    transform: `rotate(${connector?.angle ?? 0}rad)`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded ? (
        <div className="card-content is-flex is-flex-direction-column p-3" style={{ flex: "1", fheight: "100%" }}>
          <div className="">
            {/* <h3 className="title is-7 has-text-grey">Hash</h3>
          <p className="subtitle is-7 is-spaced mb-4 truncated">
            <Link to={`/block/${block.hash}`}>{block.hash}</Link>
          </p> */}

            {/* <h3 className="title is-7 has-text-grey">Status</h3>
          <p className="subtitle is-7 is-spaced mb-4">Orphaned</p> */}

            {/* <h3 className="title is-7 has-text-grey">Previous Block</h3>
              <p className="subtitle is-7 is-spaced mb-4 truncated">
                <Link to={`/block/${block.previousHash}`}>{block.previousHash ?? "-"}</Link>
              </p> */}

            <h3 className="title is-7 has-text-grey">Timestamp</h3>
            <p className="subtitle is-7 is-spaced mb-4">{format(block.timestamp, "eee, d MMM yyyy, HH:mm:ss")}</p>

            {/* <h3 className="title is-7 has-text-grey">Version</h3>
              <p className="subtitle is-7 is-spaced mb-4">{block.version}</p> */}

            <h3 className="title is-7 has-text-grey">Miner</h3>
            <p className="subtitle is-7 is-spaced truncated">
              <Link to={`/address/${block.transactions[0].outputs[0].address}`}>
                {block.transactions[0].outputs[0].address ?? "-"}
              </Link>
            </p>
          </div>
          <div className="is-flex mt-4" style={{ gap: "0.3em" }}>
            <Link
              to={`/block/${block.hash}`}
              className="button is-block is-small is-info has-text-weight-semibold"
              style={{ flexGrow: 1 }}
            >
              View
            </Link>

            <div className="dropdown is-hoverable">
              <div className="dropdown-trigger">
                <button
                  className="button is-small has-text-weight-semibold px-1"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu5"
                >
                  <span className="material-icons-outlined">more_horiz</span>
                </button>
              </div>
              <div
                className="dropdown-menu"
                id="dropdown-menu5"
                role="menu"
                style={{ left: "100%", transform: "translateX(-100%)", minWidth: 0 }}
              >
                <div className="dropdown-content is-size-7">
                  <button
                    className="dropdown-item button is-white is-flex px-3 is-align-items-center is-justify-content-start is-size-7"
                    style={{ paddingInline: 0, gap: ".5em" }}
                    onClick={() => setExpanded(false)}
                  >
                    <span className="material-icons-two-tone is-size-7">expand_less</span>
                    Less Info
                  </button>

                  <button
                    className="button is-white dropdown-item is-flex px-3 is-align-items-center is-justify-content-start is-size-7"
                    style={{ paddingInline: 0, gap: ".5em" }}
                    onClick={() => copyToClipboard(block.hash, "Block hash copied")}
                  >
                    <span className="material-icons-two-tone is-size-7">content_copy</span>
                    Copy Hash
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-content p-3 is-flex is-align-items-end" style={{ gap: ".5em" }}>
          <div style={{ minWidth: 0 }}>
            <h3 className="title is-7 has-text-grey">Miner</h3>
            <p className="subtitle is-7 is-spaced truncated mb-0">
              <Link to={`/address/${block.transactions[0].outputs[0].address}`}>
                {block.transactions[0].outputs[0].address ?? "-"}
              </Link>
            </p>
          </div>

          <div className="dropdown is-hoverable ml-auto">
            <div className="dropdown-trigger">
              <button
                className="button is-small -is-white has-text-weight-semibold px-1"
                aria-haspopup="true"
                aria-controls="dropdown-menu5"
              >
                <span className="material-icons-outlined">more_horiz</span>
              </button>
            </div>
            <div
              className="dropdown-menu"
              id="dropdown-menu5"
              role="menu"
              style={{ left: "100%", transform: "translateX(-100%)", minWidth: 0 }}
            >
              <div className="dropdown-content is-size-7">
                <button
                  className="dropdown-item button is-white is-flex px-3 is-align-items-center is-justify-content-start is-size-7"
                  style={{ paddingInline: 0, gap: ".5em" }}
                  onClick={() => setExpanded(true)}
                >
                  <span className="material-icons-two-tone is-size-7">expand_more</span>
                  More Info
                </button>

                <button
                  className="button is-white dropdown-item is-flex px-3 is-align-items-center is-justify-content-start is-size-7"
                  style={{ paddingInline: 0, gap: ".5em" }}
                  onClick={() => copyToClipboard(block.hash, "Block hash copied")}
                >
                  <span className="material-icons-two-tone is-size-7">content_copy</span>
                  Copy Hash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Block;
