import React, { useState, useRef } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { calculateBalance, getHighestValidBlock, isAddressValid, getAddressTxs } from "blockcrypto";
import QRCode from "qrcode";

import Transaction from "../components/Transaction";

const AddressPage = () => {
	const history = useHistory();
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.blockchain.params);
	const { address } = useParams();
	const [addressQR, setAddressQR] = useState("");

	QRCode.toString(address).then(setAddressQR);

	const balance = (
		calculateBalance(blockchain, getHighestValidBlock(blockchain), address) / params.coin
	).toFixed(8);

	const [receivedTxs, sentTxs] = getAddressTxs(blockchain, address);

	let isValid = false;
	try {
		isValid = isAddressValid(params, address);
	} catch {}

	const searchInput = useRef();

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
							<td>{address}</td>
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
							<td>0</td>
						</tr>
						<tr>
							<td>Total Sent</td>
							<td>0</td>
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
