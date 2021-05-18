import React from "react";
import { useSelector } from "react-redux";

import Block from "../../components/Block";
import "./blockchain.css";

const BlockchainPage = () => {
	const blockchain = useSelector(state => state.blockchain.chain);

	return (
		<section className="section">
			<h1 className="title is-2">Blockchain</h1>
			<p className="subtitle is-4">
				Explore the entire blockchain, stored locally on your computer.
			</p>
			<hr />
			<div className="blockchain">
				{blockchain.map(block => (
					<Block block={block} />
				))}
			</div>
		</section>
	);
};

export default BlockchainPage;
