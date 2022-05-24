import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

import { formatDistanceToNow } from "date-fns";
import "./blockchain.css";

import axios from "axios";

const BlockchainPage = () => {
  const { headBlock, headBlockLoaded } = useSelector(state => state.blockchain);

  const [blocks, setBlocks] = useState([]);
  const [page, setPage] = useState(0); // 0 indexed page
  const blockchainSection = useRef(null);
  const heightsPerPage = 20;
  const numFirstPages = 10;
  const numLastPages = 2;

  const getBlocks = async () => {
    const results = await axios.get(
      `/blocks?height=${headBlock.height - page * heightsPerPage}&limit=${heightsPerPage}`
    );
    setBlocks(results.data);
  };

  useEffect(() => {
    if (!headBlockLoaded) return;
    getBlocks();
  }, [headBlock, page]);

  const gotoPage = page => {
    blockchainSection.current?.scrollIntoView({ behavior: "smooth" });
    setPage(page);
  };

  if (!blocks.length || !headBlockLoaded)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  const numPages = Math.ceil((headBlock.height + 1) / heightsPerPage);

  const getStatus = block => {
    // TODO: common code in blockpage
    if (block.height >= headBlock.height - 6) return { type: "Unconfirmed", color: "has-background-warning" };
    if (!block.valid) return { type: "Orphaned", color: "has-background-danger" };
    return { type: "Confirmed", color: "has-background-success" };
  };

  return (
    <section ref={blockchainSection} className="section">
      <h1 className="title is-size-4 is-size-2-tablet">Blockchain</h1>
      <p className="subtitle is-size-6 is-size-5-tablet mb-5">Explore the entire chain up to the genesis block.</p>

      <div className="card blockchain-list px-3 px-5-tablet mb-5" style={{ paddingBlock: "2em", overflow: "auto" }}>
        <p className="title mb-0 has-text-centered" style={{ fontSize: ".87rem", minWidth: "2em" }}>
          #
        </p>
        <p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "10em" }}>
          Hash
        </p>
        <p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "6em" }}>
          Timestamp
        </p>
        <p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "8em" }}>
          Miner
        </p>
        <p className="title mb-0 has-text-centered" style={{ fontSize: ".87rem", minWidth: "7em" }}>
          Status
        </p>

        <hr className="my-0" />
        <hr className="my-0" />
        <hr className="my-0" />
        <hr className="my-0" />
        <hr className="my-0" />

        {blocks.map(block => {
          const status = getStatus(block);
          return (
            <React.Fragment key={block.hash}>
              <p
                className="subtitle mb-0 has-text-centered"
                style={{
                  fontSize: ".87rem",
                  textDecoration: status.type === "Orphaned" ? "line-through" : "none",
                }}
              >
                {block.height}
              </p>
              <p
                className="subtitle mb-0 truncated"
                style={{ fontSize: ".87rem", textDecoration: status.type === "Orphaned" ? "line-through" : "none" }}
              >
                <Link to={`/block/${block.hash}`}>{block.hash}</Link>
              </p>
              <p
                className="subtitle mb-0"
                style={{ fontSize: ".87rem", textDecoration: status.type === "Orphaned" ? "line-through" : "none" }}
              >
                {formatDistanceToNow(block.timestamp, { addSuffix: true, includeSeconds: true })}
              </p>
              <p
                className="subtitle mb-0 truncated"
                style={{ fontSize: ".87rem", textDecoration: status.type === "Orphaned" ? "line-through" : "none" }}
              >
                <Link to={`/address/${block.transactions[0].outputs[0].address}`}>
                  {block.transactions[0].outputs[0].address ?? "-"}
                </Link>
              </p>
              <p className="mb-0 has-text-centered">
                <span
                  style={{ borderRadius: "0.3em" }}
                  className={`title is-7 py-1 px-2 has-background-success has-text-white ${status.color}`}
                >
                  {status.type}
                </span>
              </p>
            </React.Fragment>
          );
        })}
      </div>

      <Pagination currentPage={page} onPageChange={gotoPage} numPages={numPages} />
    </section>
  );
};

export default BlockchainPage;
