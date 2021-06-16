import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useBlockchain } from "../../hooks/useBlockchain";
import Loading from "../../components/Loading";

import { formatDistanceToNow } from "date-fns";

import { getHighestValidBlock } from "blockcrypto";

import "./blockchain.css";

const BlockchainPage = () => {
	const [loading, params, blockchain] = useBlockchain();

	const reversed = useMemo(() => [...blockchain].reverse(), [blockchain]);
	const headBlock = useMemo(() => getHighestValidBlock(params, blockchain), [params, blockchain]);

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

	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	const displayBlockStatus = block => {
		if (headBlock.height - block.height + 1 < params.blkMaturity)
			return (
				<span
					style={{ borderRadius: "0.3em" }}
					className="title is-7 py-1 px-2 has-background-warning has-text-white"
				>
					Unconfirmed
				</span>
			);

		if (bestChainHashes.includes(block.hash))
			return (
				<span
					style={{ borderRadius: "0.3em" }}
					className="title is-7 py-1 px-2 has-background-success has-text-white "
				>
					Confirmed
				</span>
			);
		return (
			<span
				style={{ borderRadius: "0.3em" }}
				className="title is-7 py-1 px-2 has-background-danger has-text-white"
			>
				Orphaned
			</span>
		);
	};

	return (
		<section className="section">
			<h1 className="title is-2">Blockchain</h1>
			<p className="subtitle is-5 mb-5">Explore the entire chain up to the genesis block.</p>

			<div className="card blockchain-list px-5" style={{ padding: "2em" }}>
				<p className="title mb-0" style={{ fontSize: ".87rem" }}>
					Height
				</p>
				<p className="title mb-0" style={{ fontSize: ".87rem" }}>
					Hash
				</p>
				<p className="title mb-0" style={{ fontSize: ".87rem" }}>
					Timestamp
				</p>
				<p className="title mb-0" style={{ fontSize: ".87rem" }}>
					Miner
				</p>
				<p className="title mb-0" style={{ fontSize: ".87rem" }}>
					Status
				</p>

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
						<p className="mb-0 has-text-centered">{displayBlockStatus(block)}</p>
					</React.Fragment>
					// <Block key={block.hash} block={block} />
				))}
			</div>
		</section>
	);
};

export default BlockchainPage;
