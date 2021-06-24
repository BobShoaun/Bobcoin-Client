import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

import Block from "./Block";

import { bobcoinMainnet, bobcoinTestnet } from "../../config";
import axios from "axios";

const Blockchain = ({ selectedBlock, setSelectedBlock }) => {
	const network = useSelector(state => state.blockchain.network);

	const [page, setPage] = useState(0);

	const { height, width } = useWindowDimensions();

	const isTablet = width > 769;
	const isDesktop = width > 1024;
	const blocksPerPage = isDesktop ? 4 : 3;

	const [blockchainInfo, setBlockchainInfo] = useState(null);

	useEffect(async () => {
		setBlockchainInfo(null);
		const result = await axios.get(
			`${network === "mainnet" ? bobcoinMainnet : bobcoinTestnet}/blockchain/info`
		);
		setBlockchainInfo(result.data);
		console.log(result.data);
	}, [network]);

	if (!blockchainInfo) return null;

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
			{blockchainInfo.slice(page, page + blocksPerPage).map(({ block, isValid }) => (
				<div
					onClick={() => {
						setSelectedBlock?.(block);
						console.log("set head block", block);
					}}
					key={block.hash}
					className="my-3 mx-2 is-clickable"
				>
					<Block block={block} isValid={isValid} selected={selectedBlock === block} />
				</div>
			))}

			{isTablet ? (
				<button
					className="button py-6 px-1 ml-3 my-auto"
					disabled={page === blockchainInfo.length - blocksPerPage}
					onClick={() => setPage(page => Math.min(page + 4, blockchainInfo.length - blocksPerPage))}
				>
					<i className="material-icons md-48">arrow_right</i>
				</button>
			) : (
				<div className="has-text-centered">
					<button
						className="button mx-auto px-6"
						disabled={page === blockchainInfo.length - blocksPerPage}
						onClick={() =>
							setPage(page => Math.min(page + 4, blockchainInfo.length - blocksPerPage))
						}
					>
						<i className="material-icons md-48">arrow_drop_down</i>
					</button>
				</div>
			)}
		</div>
	);
};

export default Blockchain;
