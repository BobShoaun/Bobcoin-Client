import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

import Block from "./Block";
import axios from "axios";

const Blockchain = ({ blockchain, selectedBlockHash, setSelectedBlock }) => {
	const api = useSelector(state => state.network.api);
	// const [unconfirmedBlocks, setUnconfirmedBlocks] = useState(blockchain);

	// const getUnconfirmed = async () => {
	// 	const unconfirmedBlocks = (await axios.get(`${api}/blockchain/unconfirmed`)).data;
	// 	setUnconfirmedBlocks(unconfirmedBlocks);
	// };

	// useEffect(() => getUnconfirmed(), [api]);

	// const [blockchainInfo, loadBlockchain] = useBlockchainInfo();
	// const status = useSelector(state => state.blockchain.status);

	const [page, setPage] = useState(0);

	const { width } = useWindowDimensions();

	const isTablet = width > 769;
	const isDesktop = width > 1024;
	const blocksPerPage = isDesktop ? 4 : 3;
	// const lastPage = Math.ceil(blockchainInfo.length / blocksPerPage) - 1;

	const nextPage = () => {
		// if (page === lastPage) return;
		// loadBlockchain();
		// setPage(page => Math.min(page + 1, lastPage));
	};

	// if (!blockchainInfo.length) return null;

	return (
		<div className="is-flex-tablet m-2 h-100">
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
			{blockchain
				// .slice(page * blocksPerPage, page * blocksPerPage + blocksPerPage)
				.map(block => (
					<div
						onClick={() => {
							setSelectedBlock?.(block);
						}}
						key={block.hash}
						className="my-3 mx-2 -is-clickable"
						style={{ flex: "1 1 auto", minWidth: 0 }}
					>
						<Block block={block} status="Unconfirmed" selected={selectedBlockHash === block.hash} />
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
