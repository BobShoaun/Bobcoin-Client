import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { useUnconfirmedBlocks } from "../../hooks/useUnconfirmedBlocks";
import { useHeadBlock } from "../../hooks/useHeadBlock";

import Block from "./Block";
import axios from "axios";

const Blockchain = ({ showHead }) => {
  const [headBlockLoading, headBlock] = useHeadBlock();
  const [unconfirmedBlocksLoading, unconfirmedBlocks] = useUnconfirmedBlocks();

  const [blocks, setBlocks] = useState([]);
  const [page, setPage] = useState(0);

  const { width } = useWindowDimensions();

  const isTablet = width > 769;
  const isDesktop = width > 1024;
  const blocksPerPage = isDesktop ? 5 : 3;

  const getBlocks = async () => {
    if (!headBlock) return;
    setBlocks([]);
    const results = await axios.get(`/blocks?limit=6&height=${headBlock.height}`);
    console.log(results.data);
    setBlocks(results.data);
  };

  useEffect(() => getBlocks(), [headBlock]);

  const loading = headBlockLoading || unconfirmedBlocksLoading;
  if (loading) return null;

  return (
    <div className="is-flex-tablet h-100">
      {/* {isTablet ? (
				<button
					className="button py-6 px-1 mr-3 my-auto"
					// disabled={page === 0}
					// onClick={() => setPage(page => Math.max(page - 1, 0))}
				>
					<i className="material-icons md-48">arrow_left</i>
				</button>
			) : (
				<div className="has-text-centered">
					<button
						className="button mx-auto px-6"
						// disabled={page === 0}
						// onClick={() => setPage(page => Math.max(page - 1, 0))}
					>
						<i className="material-icons md-48">arrow_drop_up</i>
					</button>
				</div>
			)} */}
      {blocks.slice(0, blocksPerPage).map(block => (
        <div
          onClick={() => {}}
          key={block.hash}
          className="my-3 mx-2 -is-clickable"
          style={{ flex: "1 1 auto", minWidth: 0 }}
        >
          <Block block={block} status="Unconfirmed" selected={showHead && headBlock.hash === block.hash} />
        </div>
      ))}
      {/* 
			{isTablet ? (
				<button
					className="button py-6 px-1 ml-3 my-auto"
					// disabled={page === lastPage || status === "loading"}
					// onClick={nextPage}
				>
					<i className="material-icons md-48">arrow_right</i>
				</button>
			) : (
				<div className="has-text-centered">
					<button
						className="button mx-auto px-6"
						// disabled={page === lastPage || status === "loading"}
						// onClick={nextPage}
					>
						<i className="material-icons md-48">arrow_drop_down</i>
					</button>
				</div>
			)} */}
    </div>
  );
};

export default Blockchain;
