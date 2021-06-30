import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import { useParams as useConsensus } from "../../hooks/useParams";

import Transaction from "../../components/Transaction";

import { copyToClipboard } from "../../helpers";
import Loading from "../../components/Loading";

import { bobcoinMainnet, bobcoinTestnet } from "../../config";
import axios from "axios";

const BlockPage = () => {
	const { hash } = useParams();
	const network = useSelector(state => state.blockchain.network);

	const [loading, params] = useConsensus();

	const [blockInfo, setBlockInfo] = useState(null);

	useEffect(async () => {
		setBlockInfo(null);
		const result = await axios.get(
			`${network === "mainnet" ? bobcoinMainnet : bobcoinTestnet}/block/info/${hash}`
		);
		setBlockInfo(result.data);
		console.log(result.data);
	}, [network, hash]);

	if (!blockInfo)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	const {
		block,
		isValid,
		validation,
		transactionsInfo,
		totalInput,
		totalOutput,
		fee,
		confirmations,
		hashTarget,
		reward,
	} = blockInfo;

	return (
		<section className="section">
			<div className="is-flex is-align-items-center mb-5">
				<h1 className="title is-size-4 is-size-2-tablet mb-0">Block #{block.height}</h1>
				<div className="has-text-right ml-auto">
					{block.previousHash && (
						<Link className="button is-link fmr-3" to={`/block/${block.previousHash}`}>
							Previous Block
						</Link>
					)}
					{/* <button className="button is-link">Next Block</button> */}
				</div>
			</div>

			<table className="table is-fullwidth mb-6">
				<tbody>
					<tr>
						<td>Hash</td>
						<td style={{ wordBreak: "break-all" }}>{block.hash}</td>
					</tr>
					<tr>
						<td>Height</td>
						<td>
							{block.height} {block.height === 0 && "(Genesis)"}
						</td>
					</tr>
					<tr>
						<td>Timestamp</td>
						<td>{new Date(block.timestamp).toUTCString()}</td>
					</tr>
					<tr>
						<td>Confirmations</td>
						<td>{confirmations}</td>
					</tr>
					<tr>
						<td>Miner</td>
						<td style={{ wordBreak: "break-all" }}>
							{block.transactions[0].outputs[0].address ? (
								<div className="is-flex">
									<Link to={`/address/${block.transactions[0].outputs[0].address}`}>
										{block.transactions[0].outputs[0].address}
									</Link>
									<span
										onClick={() => copyToClipboard(block.transactions[0].outputs[0].address)}
										className="material-icons-outlined md-18 my-auto ml-2 is-clickable"
										style={{ color: "lightgray" }}
									>
										content_copy
									</span>
								</div>
							) : (
								"-"
							)}
						</td>
					</tr>

					<tr>
						<td>Difficulty</td>
						<td>{block.difficulty}</td>
					</tr>
					<tr>
						<td>Target Hash</td>
						<td style={{ wordBreak: "break-all" }}>{hashTarget}</td>
					</tr>
					<tr>
						<td>Nonce</td>
						<td>{block.nonce}</td>
					</tr>
					<tr>
						<td>Previous block</td>
						<td style={{ wordBreak: "break-all" }}>
							{block.previousHash ? (
								<Link to={`/block/${block.previousHash}`}>{block.previousHash}</Link>
							) : (
								"-"
							)}
						</td>
					</tr>
					<tr>
						<td>Number of Transactions</td>
						<td>{block.transactions.length}</td>
					</tr>
					<tr>
						<td>Merkle Root</td>
						<td style={{ wordBreak: "break-all" }}>{block.merkleRoot}</td>
					</tr>
					<tr>
						<td>Total transaction volume</td>
						<td>
							{(totalInput / params.coin).toFixed(8)} {params.symbol}
						</td>
					</tr>
					<tr>
						<td>Block reward</td>
						<td>
							{(reward / params.coin).toFixed(8)} {params.symbol}
						</td>
					</tr>
					<tr>
						<td>Total Fees</td>
						<td>
							{(fee / params.coin).toFixed(8)} {params.symbol}
						</td>
					</tr>
					<tr>
						<td>Valid</td>
						<td>
							{isValid ? (
								<div className="">
									<i className="material-icons has-text-success">check_circle_outline</i>
								</div>
							) : (
								<div className="is-flex">
									<i className="material-icons has-text-danger">dangerous</i>
									{/* <p className="ml-2">{validation.msg}</p> */}
								</div>
							)}
						</td>
					</tr>
				</tbody>
			</table>
			<h2 className="title is-4 is-spaced">Transactions in this block</h2>
			<hr />
			<div className="mb-5">
				{transactionsInfo.length &&
					transactionsInfo.map(info => (
						<div key={info.transaction.hash} className="card mb-2">
							<div className="card-content">
								<Transaction transactionInfo={info} block={block}></Transaction>
							</div>
						</div>
					))}
			</div>
		</section>
	);
};

export default BlockPage;
