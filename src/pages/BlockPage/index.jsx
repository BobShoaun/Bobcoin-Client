import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";

import Transaction from "../../components/Transaction";

import { copyToClipboard } from "../../helpers";
import Loading from "../../components/Loading";

import { bigIntToHex64, calculateHashTarget, calculateBlockReward } from "blockcrypto";

import axios from "axios";

const BlockPage = () => {
	const { hash, height } = useParams();
	const history = useHistory();
	const api = useSelector(state => state.network.api);
	const { params, fetched: paramsFetched } = useSelector(state => state.consensus);
	const { headBlock, headBlockFetched } = useSelector(state => state.blockchain);

	const [blockInfo, setBlockInfo] = useState(null);

	useEffect(async () => {
		if (!hash) return;
		setBlockInfo(null);
		const result = await axios.get(`${api}/block/info/${hash}`);
		setBlockInfo(result.data);
	}, [api, hash]);

	useEffect(async () => {
		if (!height) return;
		setBlockInfo(null);
		const result = await axios.get(`${api}/block/info/height/${height}`);
		setBlockInfo(result.data);
	}, [api, height]);

	if (!blockInfo || !paramsFetched || !headBlockFetched)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	const statusColor = status => {
		switch (status) {
			case "confirmed":
				return "has-background-success";
			case "unconfirmed":
				return "has-background-warning";
			case "orphaned":
				return "has-background-danger";
			default:
				return "has-background-primary";
		}
	};

	const { block, transactions, status } = blockInfo;

	const confirmations = headBlock.height - block.height + 1;
	const totalInput = transactions
		.slice(1)
		.reduce(
			(total, info) => total + info.inputs.reduce((total, input) => total + input.amount, 0),
			0
		);
	const totalOutput = transactions
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
					<button
						className="button is-link"
						onClick={() => history.push(`/block/${block.previousHash}`)}
						disabled={!block.previousHash}
					>
						<span className="material-icons-two-tone">arrow_back</span>
					</button>
					<button
						onClick={() => history.push(`/block/height/${block.height + 1}`)}
						className="button is-link ml-3"
						disabled={block.height >= headBlock.height}
					>
						<span className="material-icons-two-tone">arrow_forward</span>
					</button>
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
								className={`title is-7 py-1 px-2 has-background-success has-text-white capitalize ${statusColor(
									status
								)}`}
							>
								{status}
							</span>
						</td>
					</tr>
					<tr>
						<td>Confirmations</td>
						<td>{status === "orphaned" ? "-" : confirmations}</td>
					</tr>
					<tr>
						<td>Miner</td>
						<td style={{ wordBreak: "break-all" }}>
							<div className="is-flex">
								<Link to={`/address/${transactions[0].outputs[0].address}`}>
									{transactions[0].outputs[0].address}
								</Link>
								<span
									onClick={() =>
										copyToClipboard(transactions[0].outputs[0].address, "Address copied")
									}
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
				{transactions.length &&
					transactions.map(transaction => (
						<div key={transaction.hash} className="card mb-3">
							<div className="card-content">
								<Transaction transaction={transaction}></Transaction>
							</div>
						</div>
					))}
			</div>
		</section>
	);
};

export default BlockPage;
