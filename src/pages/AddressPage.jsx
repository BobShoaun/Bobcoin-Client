import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { calculateBalance, getHighestValidBlock, isAddressValid, getAddressTxs } from "blockcrypto";
import QRCode from "qrcode";

import Transaction from "../components/Transaction";

const AddressPage = () => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.blockchain.params);
	const { address } = useParams();
	const [addressQR, setAddressQR] = useState("");

	QRCode.toString(address).then(setAddressQR);

	const balance = (
		calculateBalance(blockchain, getHighestValidBlock(blockchain), address) / params.coin
	).toFixed(8);

	const [receivedTxs, sentTxs] = getAddressTxs(blockchain, address);

	return (
		<section className="section">
			<h1 className="title is-2">Address</h1>
			<p className="subtitle is-4">See this address's balance and details.</p>

			{/* <div className="field">
				<label className="label">Public key</label>
				<div className="field has-addons">
					<div className="control is-expanded">
						<input className="input" type="text" placeholder="Input public key"></input>
					</div>
					<div className="control">
						<Link to={`/address/${publicKey}`} className="button is-info">
							Search
						</Link>
					</div>
				</div>
			</div> */}

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
								{isAddressValid(params, address) ? (
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
				{receivedTxs.map(tx => (
					<div key={tx.hash} className="card card-content">
						<Transaction transaction={tx} />
					</div>
				))}
			</div>

			<h1 className="title is-3">Outbound Transactions</h1>
			<hr />
			{sentTxs.map(tx => (
				<div key={tx.hash} className="card card-content">
					<Transaction transaction={tx} />
				</div>
			))}
		</section>
	);
};

export default AddressPage;
