import React, { useState, useRef } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import {
	calculateBalance,
	getHighestValidBlock,
	isAddressValid,
	getAddressTxs,
	calculateTransactionSet,
} from "blockcrypto";
import QRCode from "qrcode";
import { copyToClipboard } from "../helpers";

import Transaction from "../components/Transaction";

function getAddressTxs2(blockchain, address) {
	const transactions = calculateTransactionSet(blockchain, getHighestValidBlock(blockchain));
	const receivedTxs = [];
	const sentTxs = [];
	for (const transaction of transactions) {
		if (transaction.outputs.some(output => output.address === address))
			receivedTxs.push(transaction);
	}
	for (const transaction of transactions) {
		if (
			transaction.inputs.some(input =>
				receivedTxs.some(
					tx => input.txHash === tx.hash && tx.outputs[input.outIndex].address === address
				)
			)
		)
			sentTxs.push(transaction);
	}
	// really doesnt make sense to split into received and sent because they are not mutually exclusive..
	// but for ui sake its good, maybe return all txs too.
	return [receivedTxs, sentTxs];
}

const AddressPage = () => {
	const history = useHistory();
	const blockchain = useSelector(state => state.blockchain.chain);
	const blockchainFetched = useSelector(state => state.blockchain.fetched);
	const params = useSelector(state => state.consensus.params);
	const paramsFetched = useSelector(state => state.consensus.fetched);
	const transactions = useSelector(state => state.transactions.txs);
	const transactionsFetched = useSelector(state => state.transactions.fetched);

	const { address } = useParams();
	const [addressQR, setAddressQR] = useState("");
	const searchInput = useRef();

	if (!blockchainFetched || !paramsFetched || !transactionsFetched) return null;

	const balance = (
		calculateBalance(blockchain, getHighestValidBlock(blockchain), address) / params.coin
	).toFixed(8);

	const findTxo = input => {
		const tx = transactions.find(tx => tx.hash === input.txHash);
		const output = tx.outputs[input.outIndex];
		return output;
	};

	const [receivedTxs, sentTxs] = getAddressTxs2(blockchain, address);
	const totalReceived = receivedTxs.reduce(
		(total, curr) =>
			total +
			curr.outputs
				.filter(out => out.address === address)
				.reduce((outT, outC) => outT + outC.amount, 0),
		0
	);

	const totalSent = sentTxs.reduce(
		(total, curr) =>
			total +
			curr.inputs.reduce((inT, inC) => {
				const txo = findTxo(inC);
				return inT + (txo.address === address ? txo.amount : 0);
			}, 0),
		0
	);

	const isValid = isAddressValid(params, address);

	QRCode.toString(address).then(setAddressQR);

	const handleSearch = event => {
		event.preventDefault();
		history.push(`./${searchInput.current.value}`);
	};

	return (
		<section className="section">
			<div className="is-flex is-align-items-end" style={{ marginBottom: "3.3em" }}>
				<div className="">
					<h1 className="title is-2">Address</h1>
					<p className="subtitle is-4">See this address's balance and details.</p>
				</div>
				<form onSubmit={handleSearch} className="ml-auto" style={{ minWidth: "20em" }}>
					<p className="control has-icons-left">
						<input
							ref={searchInput}
							className="input"
							type="search"
							placeholder="Search for an address"
						/>
						<span className="icon is-left is-small">
							<i className="material-icons">search</i>
						</span>
					</p>
				</form>
			</div>
			<div className="is-flex is-align-items-center mb-6">
				<p
					dangerouslySetInnerHTML={{ __html: addressQR }}
					className="mr-6 box"
					style={{ width: "400px" }}
				></p>
				<table className="table is-fullwidth">
					<tbody>
						<tr>
							<td>Address</td>
							<td className="is-flex">
								{address}

								<span
									onClick={() => copyToClipboard(address)}
									className="material-icons-outlined md-18 my-auto ml-2 is-clickable"
									style={{ color: "lightgrey" }}
								>
									content_copy
								</span>
							</td>
						</tr>
						<tr>
							<td>Valid?</td>
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
						<tr>
							<td>Transaction count</td>
							<td>{receivedTxs.length + sentTxs.length}</td>
						</tr>
						<tr>
							<td>Total Received</td>
							<td>
								{(totalReceived / params.coin).toFixed(8)} {params.symbol}
							</td>
						</tr>
						<tr>
							<td>Total Sent</td>
							<td>
								{(totalSent / params.coin).toFixed(8)} {params.symbol}
							</td>
						</tr>
						<tr>
							<td>Final Balance</td>
							<td className="has-text-weight-semibold">
								{balance} {params.symbol}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h1 className="title is-3">Inbound Transactions</h1>
			<hr />
			<div className="mb-6">
				{receivedTxs.length ? (
					receivedTxs.map(tx => (
						<div key={tx.hash} className="card mb-2">
							<div className="card-content">
								<Transaction transaction={tx} />
							</div>
						</div>
					))
				) : (
					<div className="py-4">
						<p className="subtitle is-6 has-text-centered">
							No one has sent {params.name}s to this address.
						</p>
					</div>
				)}
			</div>

			<h1 className="title is-3">Outbound Transactions</h1>
			<hr />
			{sentTxs.length ? (
				sentTxs.map(tx => (
					<div key={tx.hash} className="card mb-2">
						<div className="card-content">
							<Transaction transaction={tx} />
						</div>
					</div>
				))
			) : (
				<div className="py-4">
					<p className="subtitle is-6 has-text-centered">
						This address has not sent any {params.name}s.
					</p>
				</div>
			)}
		</section>
	);
};

export default AddressPage;
