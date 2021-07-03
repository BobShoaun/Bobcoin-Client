import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";

import { useParams as useConsensus } from "../../hooks/useParams";

import Transaction from "../../components/Transaction";
import { copyToClipboard } from "../../helpers";
import Loading from "../../components/Loading";

import axios from "axios";

const TransactionPage = () => {
	const { hash } = useParams();
	const location = useLocation();
	const api = useSelector(state => state.network.api);

	const [loading, params] = useConsensus();

	const blockHash = new URLSearchParams(location.search).get("block");

	const [transactionInfo, setTransactionInfo] = useState(null);

	useEffect(async () => {
		setTransactionInfo(null);
		const result = await axios.get(`${api}/transaction/info/${hash}?block=${blockHash}`);
		setTransactionInfo(result.data);
		console.log(result.data);
	}, [api, hash, blockHash]);

	if (!transactionInfo)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	const {
		transaction,
		isValid,
		validation,
		block,
		totalInput,
		totalOutput,
		fee,
		isCoinbase,
		confirmations,
	} = transactionInfo;

	const status =
		confirmations === 0 ? "Unconfirmed (in Mempool)" : `${confirmations} confirmations`;

	return (
		<section className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Transaction</h1>
			<p className="subtitle is-size-6 is-size-5-tablet">
				A transaction in the mempool or blockchain.
			</p>
			<hr />

			<h1 className="title is-4">Summary</h1>

			<div className="card card-content has-background-white">
				<Transaction transactionInfo={transactionInfo} block={block}></Transaction>
			</div>
			<hr />

			<h1 className="title is-4">Details</h1>

			<table className="table is-fullwidth mb-6">
				<tbody>
					<tr>
						<td>Hash</td>
						<td style={{ wordBreak: "break-all" }}>{transaction.hash}</td>
					</tr>
					<tr>
						<td>Status</td>
						<td>{status}</td>
					</tr>
					<tr>
						<td>Block Height</td>
						<td>{block ? block.height : "-"}</td>
					</tr>
					<tr>
						<td>Block Hash</td>
						<td style={{ wordBreak: "break-all" }}>
							{block ? <Link to={`../block/${block.hash}`}>{block.hash}</Link> : "-"}
						</td>
					</tr>
					<tr>
						<td>Timestamp</td>
						<td>{new Date(transaction.timestamp).toUTCString()}</td>
					</tr>

					<tr>
						<td>Total Input Amount</td>
						<td>
							{(totalInput / params.coin).toFixed(8)} {params.symbol}
						</td>
					</tr>
					<tr>
						<td>Total Output Amount</td>
						<td>
							{(totalOutput / params.coin).toFixed(8)} {params.symbol}
						</td>
					</tr>
					<tr>
						<td>Fee</td>
						<td>{isCoinbase ? "-" : (fee / params.coin).toFixed(8) + " " + params.symbol}</td>
					</tr>
					<tr>
						<td>Valid?</td>
						<td>
							{isValid ? (
								<div className="">
									<i className="material-icons has-text-success">check_circle_outline</i>
								</div>
							) : (
								<div className="is-flex">
									<i className="material-icons has-text-danger">dangerous</i>
									<p className="ml-2">{validation.msg}</p>
								</div>
							)}
						</td>
					</tr>
				</tbody>
			</table>

			<h1 className="title is-4">Inputs</h1>

			<div className="mb-5">
				<table className="-table mb-5" style={{ width: "100%", borderSpacing: "10px" }}>
					<colgroup>
						<col span="1" style={{ width: "20%" }} />
						<col span="1" style={{ width: "80%" }} />
					</colgroup>
					<tbody>
						{transaction.inputs.map((input, index) => (
							<React.Fragment key={index}>
								<tr>
									<td>Transaction Hash</td>
									<td className="pl-3" style={{ wordBreak: "break-all" }}>
										<Link to={`./${input.txHash}`}>{input.txHash}</Link>
									</td>
								</tr>
								<tr>
									<td>Output Index</td>
									<td className="pl-3">{input.outIndex}</td>
								</tr>
								<tr>
									<td>Public Key</td>
									<td className="pl-3" style={{ wordBreak: "break-all" }}>
										{input.publicKey}
									</td>
								</tr>
								<tr>
									<td>Signature</td>

									<td
										className="pb-5 pl-3"
										style={{
											wordWrap: "break-word",
											wordBreak: "break-word",
										}}
									>
										{input.signature}
									</td>
								</tr>
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>

			<h1 className="title is-4">Outputs</h1>

			<div className="mb-6">
				<table className="mb-5" style={{ width: "100%", borderSpacing: "10px" }}>
					<colgroup>
						<col span="1" style={{ width: "20%" }} />
						<col span="1" style={{ width: "80%" }} />
					</colgroup>
					<tbody>
						{transaction.outputs.map((output, index) => (
							<React.Fragment key={index}>
								<tr>
									<td>Index</td>
									<td className="pl-3">{index}</td>
								</tr>
								<tr>
									<td>Address</td>
									<td className="is-flex pl-3" style={{ wordBreak: "break-all" }}>
										<Link to={`/address/${output.address}`}>{output.address}</Link>
										<span
											onClick={() => copyToClipboard(output.address)}
											className="material-icons-outlined md-18 my-auto ml-2 is-clickable is-dark"
										>
											content_copy
										</span>
									</td>
								</tr>
								<tr>
									<td>Amount</td>
									<td className="pl-3 pb-5 has-text-weight-medium">
										{(output.amount / params.coin).toFixed(8)} {params.symbol}
									</td>
								</tr>
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default TransactionPage;
