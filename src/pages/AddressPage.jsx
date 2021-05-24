import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { calculateBalance, getHighestValidBlock } from "blockchain-crypto";
import QRCode from "qrcode";

const AddressPage = () => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.blockchain.params);
	const { address } = useParams();
	const [addressQR, setAddressQR] = useState("");

	QRCode.toString(address).then(setAddressQR);

	const balance = (
		calculateBalance(blockchain, getHighestValidBlock(blockchain), address) / params.coin
	).toFixed(8);

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
							<td>Transaction count</td>
							<td>0</td>
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
							<td>
								{balance} {params.symbol}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h1 className="title is-3">Transactions</h1>
			<hr />
		</section>
	);
};

export default AddressPage;
