import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Transactions from "../components/Transactions";

const BlockPage = () => {
	const { hash } = useParams();
	const blockchain = useSelector(state => state.blockchain);
	console.log("chain: ", blockchain);
	const block = blockchain.find(block => block.hash == hash);
	console.log("block: ", block);

	return (
		<section className="section">
			<h1 className="title is-2">Block {block.height}</h1>
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
						<td>{block.timestamp.toString()}</td>
					</tr>
					<tr>
						<td>Confirmations</td>
						<td>idk</td>
					</tr>
					<tr>
						<td>Miner</td>
						<td>{block.miner ? <Link to={`/wallet/${block.miner}`}>{block.miner}</Link> : "-"}</td>
					</tr>
					<tr>
						<td>Nonce</td>
						<td>{block.nonce}</td>
					</tr>
					<tr>
						<td>Difficulty</td>
						<td>3</td>
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
							{block.transactions.reduce((prev, curr) => prev + parseFloat(curr.amount), 0)} BBC
						</td>
					</tr>
					<tr>
						<td>Block reward</td>
						<td>50 BBC</td>
					</tr>
				</tbody>
			</table>
			<h2 className="title is-4 is-spaced">Transactions in this block</h2>
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
