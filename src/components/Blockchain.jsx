import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

import Block from "./Block";

const Blockchain = ({ selectedBlock, setSelectedBlock }) => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const [page, setPage] = useState(0);

	const { height, width } = useWindowDimensions();

	const isTablet = width > 769;
	const isDesktop = width > 1024;
	const blocksPerPage = isDesktop ? 4 : 3;

	const reversedBlockchain = useMemo(() => [...blockchain].reverse(), [blockchain]);

	return (
		<div className="is-flex-tablet m-2 h-100">
			{isTablet ? (
				<button
					className="button py-6 px-1 mr-3 my-auto"
					disabled={page === 0}
					onClick={() => setPage(page => Math.max(page - 4, 0))}
				>
					<i className="material-icons md-48">arrow_left</i>
				</button>
			) : (
				<div className="has-text-centered">
					<button
						className="button mx-auto px-6"
						disabled={page === 0}
						onClick={() => setPage(page => Math.max(page - 4, 0))}
					>
						<i className="material-icons md-48">arrow_drop_up</i>
					</button>
				</div>
			)}
			{reversedBlockchain.slice(page, page + blocksPerPage).map(block => (
				<div
					onClick={() => {
						setSelectedBlock?.(block);
						console.log("set head block", block);
					}}
					key={block.hash}
					className="my-3 mx-2 is-clickable"
				>
					<Block block={block} selected={selectedBlock === block} />
				</div>
			))}

			{isTablet ? (
				<button
					className="button py-6 px-1 ml-3 my-auto"
					disabled={page === blockchain.length - blocksPerPage}
					onClick={() => setPage(page => Math.min(page + 4, blockchain.length - blocksPerPage))}
				>
					<i className="material-icons md-48">arrow_right</i>
				</button>
			) : (
				<div className="has-text-centered">
					<button
						className="button mx-auto px-6"
						disabled={page === blockchain.length - blocksPerPage}
						onClick={() => setPage(page => Math.min(page + 4, blockchain.length - blocksPerPage))}
					>
						<i className="material-icons md-48">arrow_drop_down</i>
					</button>
				</div>
			)}
		</div>
	);
};

export default Blockchain;
