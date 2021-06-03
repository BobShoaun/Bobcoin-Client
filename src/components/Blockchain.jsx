import React from "react";
import { useSelector } from "react-redux";

import Block from "./Block";

const Blockchain = () => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const reversedBlockchain = [...blockchain].reverse();

	return (
		<div className="is-flex">
			{reversedBlockchain.map(block => (
				<div key={block.hash} className="mx-2 pb-5" style={{ flex: "0 1 15em", minWidth: "17em" }}>
					<Block block={block} />
				</div>
			))}
		</div>
	);
};

export default Blockchain;
