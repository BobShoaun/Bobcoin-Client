import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";

import { useParams as useConsensus } from "../../hooks/useParams";

import QRCode from "qrcode";
import { copyToClipboard } from "../../helpers";

import Transaction from "../../components/Transaction";
import Loading from "../../components/Loading";

import { isAddressValid } from "blockcrypto";

import axios from "axios";
import ReactTooltip from "react-tooltip";

const AddressPage = () => {
	const { address } = useParams();
	const history = useHistory();
	const location = useLocation();
	const searchInput = useRef();
	const [addressQR, setAddressQR] = useState("");

	const api = useSelector(state => state.network.api);

	const [loading, params] = useConsensus();

	const [addressInfo, setAddressInfo] = useState(null);

	useEffect(async () => {
		setAddressInfo(null);
		const result = await axios.get(`${api}/address/${address}`);
		setAddressInfo(result.data);
	}, [api, address]);

	useEffect(() => {
		QRCode.toString(address).then(setAddressQR);
	}, [address]);

	const handleSearch = event => {
		event.preventDefault();
		history.push(`./${searchInput.current.value}`);
	};

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

	let isValid = false;
	try {
		isValid = isAddressValid(params, address);
	} catch {}

	return (
		<section className="section">
			<div className="is-flex-tablet is-align-items-end mb-5">
				<div className="">
					<h1 className="title is-size-4 is-size-2-tablet">Address</h1>
					<p className="subtitle is-size-6 is-size-5-tablet mb-3">
						See this address's balance, transaction history, and more.
					</p>
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
			<div className="is-flex-tablet is-align-items-center mb-6">
				<p
					dangerouslySetInnerHTML={{ __html: addressQR }}
					className="mx-auto mb-6 mr-6-tablet mb-0-tablet box"
					style={{ width: "300px" }}
				></p>
				<table className="table is-fullwidth">
					<tbody>
						<tr>
							<td>Address</td>
							<td className="is-flex" style={{ wordBreak: "break-all" }}>
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
							<td className="is-flex is-align-items-center">
								<span>Valid?</span>
								<div data-tip data-for="valid" className="is-block ml-2">
									<span className="has-text-info material-icons-outlined md-14 is-block my-auto">
										info
									</span>
									<ReactTooltip id="valid" type="dark" effect="solid">
										<span>whether checksum in address is fulfilled</span>
									</ReactTooltip>
								</div>
							</td>
							<td>
								{isValid ? (
									<i className="has-text-success material-icons md-20">check_circle_outline</i>
								) : (
									<i className="has-text-danger material-icons md-20">dangerous</i>
								)}
							</td>
						</tr>
						<tr>
							<td>Transaction count</td>
							<td>{transactionsInfo.length}</td>
						</tr>
						<tr>
							<td>UTXO count</td>
							<td>{utxos.length}</td>
						</tr>
						<tr>
							<td className="is-flex is-align-items-center">
								<span>Total Received</span>
								<div data-tip data-for="total-received" className="is-block ml-2">
									<span className="has-text-info material-icons-outlined md-14 is-block my-auto">
										info
									</span>
									<ReactTooltip id="total-received" type="dark" effect="solid">
										<span>total output amount to address</span>
									</ReactTooltip>
								</div>
							</td>
							<td>
								{(totalReceived / params.coin).toFixed(8)} {params.symbol}
							</td>
						</tr>
						<tr>
							<td className="is-flex is-align-items-center">
								<span>Total Sent</span>
								<div data-tip data-for="total-sent" className="is-block ml-2">
									<span className="has-text-info material-icons-outlined md-14 is-block my-auto">
										info
									</span>
									<ReactTooltip id="total-sent" type="dark" effect="solid">
										<span>total input amount to address</span>
									</ReactTooltip>
								</div>
							</td>
							<td>
								{(totalSent / params.coin).toFixed(8)} {params.symbol}
							</td>
						</tr>
						<tr>
							<td>Final Balance</td>
							<td className="has-text-weight-semibold">
								{(balance / params.coin).toFixed(8)} {params.symbol}
							</td>
						</tr>
					</tbody>
				</table>
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
		</section>
	);
};

export default AddressPage;
