import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useParams, Link } from "react-router-dom";

import Transaction from "../../components/Transaction";

const TransactionPage = () => {
	const { hash } = useParams();

	const transactions = useSelector(state => state.transactions);
	const transaction = transactions.find(tx => tx.hash === hash);

	const totalInputAmount = transaction.inputs?.reduce((total, input) => total + input.amount, 0);
	const totalOutputAmount = transaction.outputs?.reduce(
		(total, output) => total + output.amount,
		0
	);
	const fee = totalInputAmount - totalOutputAmount;

	return (
		<section className="section">
			<h1 className="title is-2">Transaction</h1>
			<p className="subtitle is-4">A transaction in the mempool or blockchain.</p>
			<hr />

			<h1 className="title is-4">Summary</h1>

			<div className="card card-content">
				<Transaction transaction={transaction}></Transaction>
			</div>
			<hr />

			<h1 className="title is-4">Details</h1>

			<table className="table is-fullwidth mb-6">
				<tbody>
					<tr>
						<td>Hash</td>
						<td>{transaction.hash}</td>
					</tr>
					<tr>
						<td>Status</td>
						<td>Uncomfirmed</td>
					</tr>
					<tr>
						<td>Timestamp</td>
						<td>{transaction.outputs[0].timestamp}</td>
					</tr>
					<tr>
						<td>Confirmations</td>
						<td>0</td>
					</tr>
					<tr>
						<td>Total Input Amount</td>
						<td>{totalInputAmount}</td>
					</tr>
					<tr>
						<td>Total Output Amount</td>
						<td>{totalOutputAmount}</td>
					</tr>
					<tr>
						<td>Fee</td>
						<td>{fee}</td>
					</tr>
					<tr>
						<td>Signature</td>
						<td>{transaction.signature}</td>
					</tr>
				</tbody>
			</table>
		</section>
	);
};

export default TransactionPage;
