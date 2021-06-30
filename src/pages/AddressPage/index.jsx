import React, { useState, useRef, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";

import { useBlockchain } from "../../hooks/useBlockchain";
import { useParams as useConsensus } from "../../hooks/useParams";

import { getHighestValidBlock, getTxBlock } from "blockcrypto";
import QRCode from "qrcode";
import { copyToClipboard } from "../../helpers";

import Transaction from "../../components/Transaction";
import Loading from "../../components/Loading";

import { bobcoinMainnet, bobcoinTestnet } from "../../config";
import axios from "axios";

const AddressPage = () => {
	const { address } = useParams();
	const history = useHistory();
	const location = useLocation();
	const searchInput = useRef();
	const [addressQR, setAddressQR] = useState("");

	const network = useSelector(state => state.blockchain.network);

	const [loading, params] = useConsensus();

	// const [loading, params, blockchain] = useBlockchain();

	const [addressInfo, setAddressInfo] = useState(null);

	useEffect(async () => {
		setAddressInfo(null);
		const result = await axios.get(
			`${network === "mainnet" ? bobcoinMainnet : bobcoinTestnet}/address/${address}`
		);
		setAddressInfo(result.data);
	}, [network, address]);

	// const headBlockHash = useMemo(() => new URLSearchParams(location.search).get("head"), [location]);

	// const headBlock = useMemo(
	// 	() =>
	// 		blockchain.find(block => block.hash === headBlockHash) ??
	// 		getHighestValidBlock(params, blockchain),
	// 	[blockchain, params, headBlockHash]
	// );

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

	console.log(addressInfo);
	const { isValid, totalReceived, totalSent, utxos, balance, inboundTxs, outboundTxs } =
		addressInfo;

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
							<td>{inboundTxs.length + outboundTxs.length}</td>
						</tr>
						<tr>
							<td>UTXO count</td>
							<td>{utxos.length}</td>
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
								{(balance / params.coin).toFixed(8)} {params.symbol}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h1 className="title is-size-5 is-size-4-tablet mb-3">Inbound Transactions</h1>
			<div className="mb-6">
				{inboundTxs.length ? (
					inboundTxs
						.sort((a, b) => b.transaction.timestamp - a.transaction.timestamp)
						.map(tx => (
							<div key={tx.transaction.hash} className="card mb-2">
								<div className="card-content">
									<Transaction transactionInfo={tx} />
								</div>
							</div>
						))
				) : (
					<div className="has-background-white py-4">
						<p className="subtitle is-6 has-text-centered">
							No one has sent {params.name}s to this address.
						</p>
					</div>
				)}
			</div>

			<h1 className="title is-size-5 is-size-4-tablet mb-3">Outbound Transactions</h1>
			{outboundTxs.length ? (
				outboundTxs
					.sort((a, b) => b.transaction.timestamp - a.transaction.timestamp)
					.map(tx => (
						<div key={tx.transaction.hash} className="card mb-2">
							<div className="card-content">
								<Transaction transactionInfo={tx} />
							</div>
						</div>
					))
			) : (
				<div className="has-background-white py-4">
					<p className="subtitle is-6 has-text-centered">
						This address has not sent any {params.name}s.
					</p>
				</div>
			)}
		</section>
	);
};

export default AddressPage;
