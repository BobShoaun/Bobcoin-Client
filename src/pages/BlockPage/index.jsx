import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import { useParams as useConsensus } from "../../hooks/useParams";

import Transaction from "../../components/Transaction";

import { copyToClipboard } from "../../helpers";
import Loading from "../../components/Loading";

import { bigIntToHex64, calculateHashTarget, calculateBlockReward } from "blockcrypto";

import axios from "axios";

const BlockPage = () => {
	const { hash } = useParams();
	const api = useSelector(state => state.network.api);

	const [loading, params] = useConsensus();

	const [blockInfo, setBlockInfo] = useState(null);

	useEffect(async () => {
		setBlockInfo(null);
		const result = await axios.get(`${api}/block/info/${hash}`);
		setBlockInfo(result.data);
	}, [api, hash]);

	if (!blockInfo || loading)
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

	const { block, transactionsInfo, confirmations, status } = blockInfo;

	const totalInput = transactionsInfo
		.slice(1)
		.reduce(
			(total, info) => total + info.inputs.reduce((total, input) => total + input.amount, 0),
			0
		);
	const totalOutput = transactionsInfo
		.slice(1)
		.reduce(
			(total, info) => total + info.outputs.reduce((total, output) => total + output.amount, 0),
			0
		);

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
						<td>Status</td>
						<td>
							<span
								style={{ borderRadius: "0.3em" }}
								className={`title is-7 py-1 px-2 has-background-success has-text-white ${statusColor(
									status
								)}`}
							>
								{status}
							</span>
						</td>
					</tr>
					<tr>
						<td>Confirmations</td>
						<td>{confirmations}</td>
					</tr>
					<tr>
						<td>Miner</td>
						<td style={{ wordBreak: "break-all" }}>
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
						</td>
					</tr>

					<tr>
						<td>Difficulty</td>
						<td>{block.difficulty}</td>
					</tr>
					<tr>
						<td>Target Hash</td>
						<td style={{ wordBreak: "break-all" }}>
							{bigIntToHex64(calculateHashTarget(params, block))}
						</td>
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
						<td>Total transacted amount</td>
						<td>
							{(totalInput / params.coin).toFixed(8)} {params.symbol}
						</td>
					</tr>
					<tr>
						<td>Block reward</td>
						<td>
							{(calculateBlockReward(params, block.height) / params.coin).toFixed(8)}{" "}
							{params.symbol}
						</td>
					</tr>
					<tr>
						<td>Total Fees</td>
						<td>
							{((totalInput - totalOutput) / params.coin).toFixed(8)} {params.symbol}
						</td>
					</tr>
				</tbody>
			</table>
			<h2 className="title is-4">Transactions in this block</h2>
			<div className="mb-5">
				{transactionsInfo.length &&
					transactionsInfo.map(({ transaction, inputs, outputs }, index) => (
						<div key={transaction.hash} className="card mb-3">
							<div className="card-content">
								<Transaction
									isCoinbase={index === 0}
									confirmations={confirmations}
									transaction={transaction}
									inputs={inputs}
									outputs={outputs}
									block={block}
									status={status}
								></Transaction>
							</div>
						</div>
					))}
			</div>
		</section>
	);
};

export default BlockPage;
