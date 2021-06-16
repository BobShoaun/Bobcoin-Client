import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";

import { useBlockchain } from "../../hooks/useBlockchain";

import Transaction from "../../components/Transaction";
import {
	getBlockConfirmations,
	getHighestValidBlock,
	isCoinbaseTxValid,
	isTransactionValid,
	RESULT,
	findTXO,
} from "blockcrypto";

import { copyToClipboard } from "../../helpers";

const TransactionPage = () => {
	const { hash } = useParams();
	const location = useLocation();

	const [loading, params, blockchain, transactions] = useBlockchain();

	if (loading) return null;

	const blockHash = new URLSearchParams(location.search).get("block");
	const transaction = transactions.find(tx => tx.hash === hash);

	const totalInputAmount = transaction.inputs.reduce(
		(total, input) => total + findTXO(input, transactions).amount,
		0
	);
	const totalOutputAmount = transaction.outputs.reduce((total, output) => total + output.amount, 0);
	const fee = totalInputAmount - totalOutputAmount;

	const isCoinbase = transaction.inputs.length === 0 && transaction.outputs.length === 1;

	const block =
		blockchain.find(block => block.hash === blockHash) ?? getHighestValidBlock(params, blockchain);
	const confirmations = getBlockConfirmations(params, blockchain, block);
	const status =
		confirmations === 0 ? "Unconfirmed (in Mempool)" : `${confirmations} confirmations`;

	const validation = isCoinbase
		? isCoinbaseTxValid(params, transaction)
		: isTransactionValid(params, transactions, transaction);

	const isValid = validation.code === RESULT.VALID;

	return (
		<section className="section">
			<h1 className="title is-2">Transaction</h1>
			<p className="subtitle is-4">A transaction in the mempool or blockchain.</p>
			<hr />

			<h1 className="title is-4">Summary</h1>

			<div className="card card-content has-background-white">
				<Transaction transaction={transaction} block={block}></Transaction>
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
						<td>{status}</td>
					</tr>
					<tr>
						<td>Block Height</td>
						<td>{block ? block.height : "-"}</td>
					</tr>
					<tr>
						<td>Block Hash</td>
						<td>{block ? <Link to={`../block/${block.hash}`}>{block.hash}</Link> : "-"}</td>
					</tr>
					<tr>
						<td>Timestamp</td>
						<td>{transaction.timestamp}</td>
					</tr>

					<tr>
						<td>Total Input Amount</td>
						<td>
							{(totalInputAmount / params.coin).toFixed(8)} {params.symbol}
						</td>
					</tr>
					<tr>
						<td>Total Output Amount</td>
						<td>
							{(totalOutputAmount / params.coin).toFixed(8)} {params.symbol}
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
									<td>
										<Link to={`./${input.txHash}`}>{input.txHash}</Link>
									</td>
								</tr>
								<tr>
									<td>Output Index</td>
									<td>{input.outIndex}</td>
								</tr>
								<tr>
									<td>Public Key</td>
									<td>{input.publicKey}</td>
								</tr>
								<tr>
									<td>Signature</td>

									<td
										className="pb-5"
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
									<td>{index}</td>
								</tr>
								<tr>
									<td>Address</td>
									<td className="is-flex">
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
									<td className="pb-5 has-text-weight-medium">
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
