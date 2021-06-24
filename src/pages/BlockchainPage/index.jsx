import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Loading from "../../components/Loading";

import { formatDistanceToNow } from "date-fns";
import "./blockchain.css";

import { bobcoinMainnet, bobcoinTestnet } from "../../config";
import axios from "axios";

const BlockchainPage = () => {
	const network = useSelector(state => state.blockchain.network);

	const [blockchainInfo, setBlockchainInfo] = useState(null);

	useEffect(async () => {
		setBlockchainInfo(null);
		const result = await axios.get(
			`${network === "mainnet" ? bobcoinMainnet : bobcoinTestnet}/blockchain/info?limit=10`
		);
		setBlockchainInfo(result.data);
	}, [network]);

	const loadMore = async () => {
		const { block } = blockchainInfo[blockchainInfo.length - 1];
		const result = await axios.get(
			`${network === "mainnet" ? bobcoinMainnet : bobcoinTestnet}/blockchain/info?limit=10&height=${
				block.height
			}&timestamp=${block.timestamp}`
		);
		setBlockchainInfo(info => [...info, ...result.data]);
	};

	if (!blockchainInfo)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	const statusColor = status => {
		switch (status) {
			case "Confirmed":
				return "has-background-success";
			case "Unconfirmed":
				return "has-background-warning";
			case "Orphaned":
				return "has-background-danger";
			default:
				return "has-background-primary";
		}
	};

	return (
		<section className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Blockchain</h1>
			<p className="subtitle is-size-6 is-size-5-tablet mb-5">
				Explore the entire chain up to the genesis block.
			</p>

			<div
				className="card blockchain-list px-3 px-5-tablet mb-5"
				style={{ paddingBlock: "2em", overflow: "auto" }}
			>
				<p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "3.5em" }}>
					Height
				</p>
				<p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "10em" }}>
					Hash
				</p>
				<p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "6em" }}>
					Timestamp
				</p>
				<p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "8em" }}>
					Miner
				</p>
				<p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "7em" }}>
					Status
				</p>

				<hr className="my-0" />
				<hr className="my-0" />
				<hr className="my-0" />
				<hr className="my-0" />
				<hr className="my-0" />

				{blockchainInfo.map(({ block, status }) => (
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
						<p className="mb-0 has-text-centered">
							<span
								style={{ borderRadius: "0.3em" }}
								className={`title is-7 py-1 px-2 has-background-success has-text-white ${statusColor(
									status
								)}`}
							>
								{status}
							</span>
						</p>
					</React.Fragment>
					// <Block key={block.hash} block={block} />
				))}
			</div>
			<div className="has-text-centered">
				<button onClick={loadMore} className="button">
					Load more
				</button>
			</div>
		</section>
	);
};

export default BlockchainPage;
