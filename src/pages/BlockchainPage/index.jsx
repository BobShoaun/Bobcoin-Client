import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

import { formatDistanceToNow } from "date-fns";
import { getBlockStatus } from "../../helpers";
import useDidUpdateEffect from "../../hooks/useUpdateEffect";

import "./blockchain.css";

import axios from "axios";

const BlockchainPage = () => {
  const { headBlock, headBlockLoaded } = useSelector(state => state.blockchain);
  const { params, paramsLoaded } = useSelector(state => state.consensus);

  const [blocks, setBlocks] = useState([]);
  const [page, setPage] = useState(0); // 0 indexed page
  const blockchainSection = useRef(null);
  const heightsPerPage = 40;

  const getBlocks = async () => {
    const { data } = await axios.get(
      `/blocks?height=${headBlock.height - page * heightsPerPage}&limit=${heightsPerPage}`
    );
    setBlocks(data);
  };

  useEffect(() => {
    if (!headBlockLoaded) return;
    getBlocks();
  }, [headBlock, page]);

  useDidUpdateEffect(
    () =>
      (async () => {
        await getBlocks();
        blockchainSection.current?.scrollIntoView({ behavior: "smooth" });
      })(),
    [page]
  );

  if (!blocks.length || !headBlockLoaded || !paramsLoaded) return <Loading />;

  const numPages = Math.ceil((headBlock.height + 1) / heightsPerPage);

  return (
    <section ref={blockchainSection} style={{ scrollMargin: "5rem" }} className="section">
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
          const status = getBlockStatus(block, headBlock, params);
          return (
            <Fragment key={block.hash}>
              <p
                className="subtitle mb-0 has-text-centered"
                style={{
                  fontSize: ".87rem",
                  textDecoration: block.valid ? "none" : "line-through",
                  fontWeight: block.valid ? "600" : "normal",
                }}
              >
                {block.height.toLocaleString()}
              </p>
              <p
                className="subtitle mb-0 truncated"
                style={{ fontSize: ".87rem", textDecoration: block.valid ? "none" : "line-through" }}
              >
                <Link to={`/block/${block.hash}`}>{block.hash}</Link>
              </p>
              <p
                className="subtitle mb-0"
                style={{ fontSize: ".87rem", textDecoration: block.valid ? "none" : "line-through" }}
              >
                {formatDistanceToNow(block.timestamp, { addSuffix: true, includeSeconds: true })}
              </p>
              <p
                className="subtitle mb-0 truncated"
                style={{ fontSize: ".87rem", textDecoration: block.valid ? "none" : "line-through" }}
              >
                <Link to={`/address/${block.transactions[0].outputs[0].address}`}>
                  {block.transactions[0].outputs[0].address ?? "-"}
                </Link>
              </p>
              <p className="mb-0 has-text-centered">
                <span
                  style={{ borderRadius: "0.3em", whiteSpace: "nowrap" }}
                  className={`title is-7 py-1 px-2 has-text-white ${status.colorClass}`}
                >
                  {status.text}
                </span>
              </p>
            </Fragment>
          );
        })}
      </div>

      <Pagination currentPage={page} onPageChange={setPage} numPages={numPages} />
    </section>
  );
};

export default BlockchainPage;
