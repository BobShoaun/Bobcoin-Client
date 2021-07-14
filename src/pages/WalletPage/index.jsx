import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import Onboarding from "./Onboarding";
import Loading from "../../components/Loading";
import "./index.css";

import { useParams, useHistory, useLocation } from "react-router-dom";

import { useParams as useConsensus } from "../../hooks/useParams";
import { useMempool } from "../../hooks/useMempool";

import QRCode from "qrcode";
import { copyToClipboard } from "../../helpers";

import Transaction from "../../components/Transaction";

import { isAddressValid } from "blockcrypto";

import axios from "axios";
import ReactTooltip from "react-tooltip";

const WalletPage = () => {
	// const { address } = useParams();
	const address = "8UVo1jeAhigidZo3zamQzdjZfqA3YBm";
	const history = useHistory();
	const location = useLocation();
	const [addressQR, setAddressQR] = useState("");

	const api = useSelector(state => state.network.api);

	const [loading, params] = useConsensus();
	const [loadingMempool, mempool] = useMempool();

	const [addressInfo, setAddressInfo] = useState(null);

	const newUser = false;

	useEffect(async () => {
		setAddressInfo(null);
		const result = await axios.get(`${api}/address/${address}`);
		setAddressInfo(result.data);
	}, [api, address]);

	useEffect(() => {
		QRCode.toString(address).then(setAddressQR);
	}, [address]);

	if (!addressInfo)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	const { utxos, transactionsInfo } = addressInfo;
	const balance = utxos.reduce((total, utxo) => total + utxo.amount, 0);
	const totalReceived = transactionsInfo.reduce(
		(total, { outputs }) =>
			total +
			outputs
				.filter(output => output.address === address)
				.reduce((total, output) => total + output.amount, 0),
		0
	);
	const totalSent = transactionsInfo.reduce(
		(total, { inputs }) =>
			total +
			inputs
				.filter(input => input.address === address)
				.reduce((total, input) => total + input.amount, 0),
		0
	);

	let isValid = isAddressValid(params, address);

	return (
		<main className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Wallet</h1>
			<p className="subtitle is-size-6 is-size-5-tablet">
				Your wallet containing all the keys to your coins.
			</p>
			{newUser ? (
				<Onboarding></Onboarding>
			) : (
				<>
					{/* <p
							dangerouslySetInnerHTML={{ __html: addressQR }}
							className="mx-auto mb-6 mr-6-tablet mb-0-tablet box"
							style={{ width: "300px" }}
						></p> */}

					<div className="is-flex-tablet is-align-items-start mb-5" style={{ gap: "2em" }}>
						<div className="card mb-4" style={{ flexBasis: "23em" }}>
							<div
								className="card-content is-flex is-justify-content-center"
								style={{ gap: "1em" }}
							>
								<div
									onClick={() => history.push("wallet/send")}
									className="has-text-centered px-3 is-clickable"
									style={{ flexBasis: "6em" }}
								>
									<div className="material-icons-two-tone">send</div>
									<p className="subtitle is-6">Send</p>
								</div>

								<div
									onClick={() => history.push("wallet/receive")}
									className="has-text-centered px-3 is-clickable"
									style={{ flexBasis: "6em" }}
								>
									<div className="material-icons-two-tone">call_received</div>
									<p className="subtitle is-6">Receive</p>
								</div>
								<div
									onClick={() => history.push("wallet/keys")}
									className="has-text-centered px-3 is-clickable"
									style={{ flexBasis: "6em" }}
								>
									<div className="material-icons-two-tone">lock</div>
									<p className="subtitle is-6">Keys</p>
								</div>
							</div>
						</div>
						<div className="card">
							<div className="card-content px-6">
								<h3 className="title is-6">Balance: </h3>
								<p className="subtitle is-1">
									{(balance / params.coin).toFixed(8)}
									<span className="subtitle is-3">{params.symbol}</span>
								</p>
							</div>
						</div>
					</div>
					<div className="card mb-5">
						<div className="card-content">
							<h2 className="title is-5 mb-3">Your Addresses</h2>
							<table className="table is-fullwidth">
								<thead>
									<tr>
										<th>Address</th>
										<th>Derivation path</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>fsdfasdfasdfsfasdf</td>
										<td>m/44'/8888'/0'/0/1</td>
									</tr>

									<tr></tr>
								</tbody>
							</table>
						</div>
					</div>

					<h1 className="title is-size-5 is-size-4-tablet mb-3">Pending transactions</h1>
					<div className="mb-6">
						{mempool.map(({ transaction, inputs, outputs }) => (
							<div key={transaction.hash} className="card mb-3">
								<div className="card-content">
									<Transaction transaction={transaction} inputs={inputs} outputs={outputs} />
								</div>
							</div>
						))}
					</div>

					<h1 className="title is-size-5 is-size-4-tablet mb-3">Transactions</h1>
					<div className="mb-6">
						{transactionsInfo.length ? (
							transactionsInfo
								.sort((a, b) => b.transaction.timestamp - a.transaction.timestamp)
								.map(({ transaction, inputs, outputs }) => (
									<div key={transaction.hash} className="card mb-3">
										<div className="card-content">
											<Transaction transaction={transaction} inputs={inputs} outputs={outputs} />
										</div>
									</div>
								))
						) : (
							<div className="has-background-white py-4">
								<p className="subtitle is-6 has-text-centered">
									The address has not sent or received{" "}
									<span className="is-lowercase">{params.name}</span>s.
								</p>
							</div>
						)}
					</div>
				</>
			)}
		</main>
	);
};

export default WalletPage;
