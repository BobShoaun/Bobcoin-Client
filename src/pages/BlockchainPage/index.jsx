import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { formatDistanceToNow } from "date-fns";

import { getHighestValidBlock } from "blockcrypto";

import "./blockchain.css";

const BlockchainPage = () => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.consensus.params);
	const reversed = useMemo(() => [...blockchain].reverse(), [blockchain]);
	const headBlock = useMemo(() => getHighestValidBlock(params, blockchain), [blockchain]);

	const getBestChainHashes = () => {
		const hashes = [];
		let currentBlkHash = headBlock.hash;
		for (const block of reversed) {
			if (block.hash !== currentBlkHash) continue;
			hashes.push(block.hash);
			currentBlkHash = block.previousHash;
		}
		return hashes;
	};

	const bestChainHashes = useMemo(() => headBlock && getBestChainHashes(), [headBlock, reversed]);

	return (
		<section className="section">
			<h1 className="title is-2">Blockchain</h1>
			<p className="subtitle is-4 mb-5">Explore the entire blockchain.</p>

			<div className="card blockchain-list px-5 py-6">
				<p className="title is-6 mb-0">Height</p>
				<p className="title is-6 mb-0">Hash</p>
				<p className="title is-6 mb-0">Timestamp</p>
				<p className="title is-6 mb-0">Miner</p>
				<p className="title is-6 mb-0">Status</p>

				<hr className="my-0" />
				<hr className="my-0" />
				<hr className="my-0" />
				<hr className="my-0" />
				<hr className="my-0" />

				{reversed.map(block => (
					<React.Fragment key={block.hash}>
						<p className="subtitle mb-0 has-text-centered" style={{ fontSize: ".87rem" }}>
							{block.height}
						</p>
						<p className="subtitle mb-0" style={{ fontSize: ".87rem" }}>
							{" "}
							<Link to={`/block/${block.hash}`}>{block.hash}</Link>
						</p>
						<p className="subtitle mb-0" style={{ fontSize: ".87rem" }}>
							{formatDistanceToNow(block.timestamp, { addSuffix: true, includeSeconds: true })}
						</p>
						<p className="subtitle mb-0" style={{ fontSize: ".87rem" }}>
							<Link to={`/address/${block.transactions[0].outputs[0].address}`}>
								{block.transactions[0].outputs[0].address ?? "-"}
							</Link>
						</p>
						<p className="mb-0">
							{bestChainHashes?.some(hash => hash === block.hash) ? (
								<span
									style={{ borderRadius: "0.3em" }}
									className="title is-7 py-1 px-2 has-background-success has-text-white"
								>
									Confirmed
								</span>
							) : (
								<span
									style={{ borderRadius: "0.3em" }}
									className="title is-7 py-1 px-2 has-background-danger has-text-white"
								>
									Orphaned
								</span>
							)}
						</p>
					</React.Fragment>
					// <Block key={block.hash} block={block} />
				))}
			</div>
		</section>
	);
};

export default BlockchainPage;
