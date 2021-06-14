import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import Block from "./Block";

const Blockchain = () => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const [page, setPage] = useState(0);
	const blocksPerPage = 4;

	const reversedBlockchain = useMemo(() => [...blockchain].reverse(), [blockchain]);

	return (
		<div className="is-flex-tablet is-justify-content-space-between h-100">
			<button
				className="button py-6 px-1 mr-4 my-auto"
				disabled={page === 0}
				onClick={() => setPage(page => Math.max(page - 4, 0))}
			>
				<i className="material-icons md-48">arrow_left</i>
			</button>
			{reversedBlockchain.slice(page, page + blocksPerPage).map(block => (
				<div key={block.hash} className="my-3 mx-2 is-clickable">
					<Block block={block} />
				</div>
			))}
			<button
				className="button py-6 px-1 ml-4 my-auto"
				disabled={page === blockchain.length - blocksPerPage}
				onClick={() => setPage(page => Math.min(page + 4, blockchain.length - blocksPerPage))}
			>
				<i className="material-icons md-48">arrow_right</i>
			</button>
		</div>
	);
};

export default Blockchain;
