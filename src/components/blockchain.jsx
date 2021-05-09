import React from "react";
import { useSelector } from "react-redux";

import Block from "./Block";

const Blockchain = () => {
	const blockchain = useSelector(state => state.blockchain);
	return (
		<div className="is-flex is-align-items-stretch">
			{blockchain.map(block => (
				<div key={block.hash} className="my-3 mx-2" style={{ flex: "0 1 15em", minWidth: "15em" }}>
					<Block block={block} className="" />
				</div>
			))}
		</div>
	);
};

export default Blockchain;
