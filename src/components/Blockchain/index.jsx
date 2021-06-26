import React, { useState } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

import Block from "./Block";

import { useBlockchainInfo } from "../../hooks/useBlockchainInfo";

const Blockchain = ({ selectedBlockHash, setSelectedBlock }) => {
	const [blockchainInfo, loadBlockchain] = useBlockchainInfo();

	const [page, setPage] = useState(0);

	const { height, width } = useWindowDimensions();

	const isTablet = width > 769;
	const isDesktop = width > 1024;
	const blocksPerPage = isDesktop ? 4 : 3;
	const lastPage = Math.ceil(blockchainInfo.length / blocksPerPage) - 1;

	const nextPage = () => {
		if (page === lastPage) loadBlockchain();

		setPage(page => Math.min(page + 1, lastPage));
	};

	if (!blockchainInfo.length) return null;

	return (
		<div className="is-flex-tablet m-2 h-100">
			{isTablet ? (
				<button
					className="button py-6 px-1 mr-3 my-auto"
					disabled={page === 0}
					onClick={() => setPage(page => Math.max(page - 1, 0))}
				>
					<i className="material-icons md-48">arrow_left</i>
				</button>
			) : (
				<div className="has-text-centered">
					<button
						className="button mx-auto px-6"
						disabled={page === 0}
						onClick={() => setPage(page => Math.max(page - 1, 0))}
					>
						<i className="material-icons md-48">arrow_drop_up</i>
					</button>
				</div>
			)}
			{blockchainInfo
				.slice(page * blocksPerPage, page * blocksPerPage + blocksPerPage)
				.map(({ block, validation }) => (
					<div
						onClick={() => {
							setSelectedBlock?.(block);
							console.log("set head block", block);
						}}
						key={block.hash}
						className="my-3 mx-2 is-clickable"
					>
						<Block
							block={block}
							validation={validation}
							selected={selectedBlockHash === block.hash}
						/>
					</div>
				))}

			{isTablet ? (
				<button
					className="button py-6 px-1 ml-3 my-auto"
					// disabled={page === lastPage}
					onClick={nextPage}
				>
					<i className="material-icons md-48">arrow_right</i>
				</button>
			) : (
				<div className="has-text-centered">
					<button
						className="button mx-auto px-6"
						// disabled={page === blockchainInfo.length - blocksPerPage}
						onClick={nextPage}
					>
						<i className="material-icons md-48">arrow_drop_down</i>
					</button>
				</div>
			)}
		</div>
	);
};

export default Blockchain;
