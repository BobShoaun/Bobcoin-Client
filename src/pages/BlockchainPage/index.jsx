import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { formatDistanceToNow } from "date-fns";

import Block from "../../components/Block";
import "./blockchain.css";

const BlockchainPage = () => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const reversed = [...blockchain].reverse();

	return (
		<section className="section">
			<h1 className="title is-2">Blockchain</h1>
			<p className="subtitle is-4 mb-5">Explore the entire blockchain.</p>

			<div className="card blockchain-list px-5 py-6">
				<p className="title is-6 mb-0">Height</p>
				<p className="title is-6 mb-0">Hash</p>
				<p className="title is-6 mb-0">Timestamp</p>
				<p className="title is-6 mb-0">Miner</p>

				<hr className="my-0" />
				<hr className="my-0" />
				<hr className="my-0" />
				<hr className="my-0" />

				{reversed.map(block => (
					<React.Fragment key={block.hash}>
						<p className="subtitle is-6 mb-0 has-text-centered">{block.height}</p>
						<p className="subtitle is-6 mb-0">
							{" "}
							<Link to={`/block/${block.hash}`}>{block.hash}</Link>
						</p>
						<p className="subtitle is-6 mb-0">
							{formatDistanceToNow(block.timestamp, { addSuffix: true, includeSeconds: true })}
						</p>
						<p className="subtitle is-6 mb-0">{block.transactions[0].outputs[0].address}</p>
					</React.Fragment>
					// <Block key={block.hash} block={block} />
				))}
			</div>
		</section>
	);
};

export default BlockchainPage;
