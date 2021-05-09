import React from "react";
import { useSelector } from "react-redux";

import Block from "./Block";

const Blockchain = () => {
	const blockchain = useSelector(state => state.blockchain);
	return (
		<div className="columns" style={{ overflowX: "auto" }}>
			{blockchain.map((block, index) => (
				<div key={index} className="column is-3">
					<Block block={block} index={index} className="" />
				</div>
			))}
		</div>
	);
};

export default Blockchain;
