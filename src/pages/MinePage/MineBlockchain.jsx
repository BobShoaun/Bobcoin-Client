import React from "react";
import { useSelector } from "react-redux";

import Block from "../../components/Block";

const MineBlockchain = ({ selectBlock }) => {
	const blockchain = useSelector(state => state.blockchain);

	const reversedBlockchain = [...blockchain].reverse();

	return (
		<div className="is-flex">
			{reversedBlockchain.map(block => (
				<div
					onClick={() => selectBlock(block)}
					key={block.hash}
					className="my-3 mx-2 is-clickable"
					style={{ flex: "0 1 15em", minWidth: "15em" }}
				>
					<Block block={block} className="" />
				</div>
			))}
		</div>
	);
};

export default MineBlockchain;
