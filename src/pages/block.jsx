import React from "react";
import { useSelector } from "react-redux";
import Transactions from "../components/transactions";

const Block = props => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const block = blockchain.find(block => block.hash == props.match.params.hash);
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
						<td>{block.timestamp}</td>
					</tr>
					<tr>
						<td>Confirmations</td>
						<td>idk</td>
					</tr>
					<tr>
						<td>Miner</td>
						<td>{block.miner ? <a href={`/wallet/${block.miner}`}>{block.miner}</a> : "-"}</td>
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
								<a href={`/block/${block.previousHash}`}>{block.previousHash}</a>
							) : (
								"-"
							)}
						</td>
					</tr>
					<tr>
						<td>Number of Transactions</td>
						<td>{block.data.length}</td>
					</tr>
					<tr>
						<td>Total transaction volume</td>
						<td>{block.data?.reduce((prev, curr) => prev + parseFloat(curr.amount), 0)} BBC</td>
					</tr>
					<tr>
						<td>Block reward</td>
						<td>50 BBC</td>
					</tr>
				</tbody>
			</table>
			<h2 className="title is-4 is-spaced">Transactions in this block</h2>
			<div className="mb-5">
				{block.data.length ? (
					<Transactions transactions={block.data}></Transactions>
				) : (
					<p className="subtitle has-text-centered is-6">
						This block does not contain any transactions.
					</p>
				)}
			</div>
		</section>
	);
};

export default Block;
