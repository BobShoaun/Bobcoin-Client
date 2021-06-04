import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Transactions from "../../components/Transactions";
import { copyToClipboard } from "../../helpers";

import { calculateBlockReward, getBlockConfirmations, isBlockValidInBlockchain } from "blockcrypto";

const BlockPage = () => {
	const { hash } = useParams();
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.consensus.params);

	const block = blockchain.find(block => block.hash === hash);
	if (!block) return null;

	let isValid = false;
	try {
		isValid = isBlockValidInBlockchain(params, blockchain, block);
	} catch (e) {
		console.log(e);
	}

	return (
		<section className="section">
			<div className="is-flex is-align-items-center mb-5">
				<h1 className="title is-2 mb-0">Block #{block.height}</h1>
				<div className="has-text-right ml-auto">
					<button className="button is-link mr-3">Previous Block</button>
					<button className="button is-link">Next Block</button>
				</div>
			</div>

			<table className="table is-fullwidth mb-6">
				<tbody>
					<tr>
						<td>Hash</td>
						<td>{block.hash}</td>
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
						<td>{getBlockConfirmations(blockchain, block)}</td>
					</tr>
					<tr>
						<td>Miner</td>
						<td>
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
						<td>Nonce</td>
						<td>{block.nonce}</td>
					</tr>
					<tr>
						<td>Difficulty</td>
						<td>{block.difficulty}</td>
					</tr>
					<tr>
						<td>Previous block</td>
						<td>
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
						<td>Total transaction volume</td>
						<td>
							{block.transactions.reduce((prev, curr) => prev + parseFloat(curr.amount), 0)}{" "}
							{params.symbol}
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
						<td>Fee reward</td>
						<td>idk {params.symbol}</td>
					</tr>
					<tr>
						<td>Valid</td>
						<td>
							{isValid ? (
								<div className="icon has-text-success ml-auto">
									<i className="material-icons">check_circle_outline</i>
								</div>
							) : (
								<div className="icon has-text-danger ml-auto">
									<i className="material-icons">dangerous</i>
								</div>
							)}
						</td>
					</tr>
				</tbody>
			</table>
			<h2 className="title is-4 is-spaced">Transactions in this block</h2>
			<hr />
			<div className="mb-5">
				{block.transactions.length ? (
					<Transactions transactions={block.transactions}></Transactions>
				) : (
					<p className="subtitle has-text-centered is-6">
						This block does not contain any transactions.
					</p>
				)}
			</div>
		</section>
	);
};

export default BlockPage;
