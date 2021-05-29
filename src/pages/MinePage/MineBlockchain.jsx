import React, { useState } from "react";
import { useSelector } from "react-redux";

import Block from "../../components/Block";

const MineBlockchain = ({ selectBlock }) => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const [page, setPage] = useState(0);
	const blocksPerPage = 4;

	const reversedBlockchain = [...blockchain].reverse();

	return (
		<div className="is-flex is-align-items-center is-justify-content-space-between">
			<button
				className="button py-6 px-1 mr-4"
				disabled={page === 0}
				onClick={() => setPage(page => Math.max(page - 4, 0))}
			>
				<i className="material-icons md-48">arrow_left</i>
			</button>
			{reversedBlockchain.slice(page, page + blocksPerPage).map(block => (
				<div onClick={() => selectBlock(block)} key={block.hash} className="my-3 mx-2 is-clickable">
					<Block block={block} className="" />
				</div>
			))}
			<button
				className="button py-6 px-1 ml-4"
				disabled={page === blockchain.length - blocksPerPage}
				onClick={() => setPage(page => Math.min(page + 4, blockchain.length - blocksPerPage))}
			>
				<i className="material-icons md-48">arrow_right</i>
			</button>
		</div>
	);
};

export default MineBlockchain;
