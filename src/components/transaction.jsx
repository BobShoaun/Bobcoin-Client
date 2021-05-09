import React from "react";
import { Link } from "react-router-dom";

import { isTransactionValid } from "blockchain-crypto";

const Transaction = ({ transaction }) => {
	const keyText = {
		maxWidth: "20em",
		display: "block",
		whiteSpace: "pre-wrap",
		wordWrap: "break-word",
	};
	const signatureText = {
		// display: "block",
		maxWidth: "55em",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	};

	return (
		<div className="">
			<div className="is-flex mb-1">
				<h3 className="title is-6 mb-0">Hash: &nbsp;</h3>
				<Link to="/" className="">
					<p className="subtitle is-6 mb-0"> {transaction.hash ?? "no hash"}</p>
				</Link>
				{isTransactionValid(transaction) ? (
					<div className="icon has-text-success ml-auto">
						<i className="material-icons">check_circle_outline</i>
					</div>
				) : (
					<div className="icon has-text-danger ml-auto">
						<i className="material-icons">dangerous</i>
					</div>
				)}
			</div>

			<div className="is-flex is-justify-content-start is-align-items-baseline mb-2">
				<h3 className="title is-6 mb-0">Signature: &nbsp;</h3>
				<p style={signatureText} className="subtitle is-6 mb-0">
					{transaction.signature}
				</p>
			</div>

			<div className="is-flex">
				<div className="">
					<span style={keyText}>
						{transaction.inputs[0]?.address ? (
							<Link to={`/wallet/${transaction.inputs[0].address}`}>
								{transaction.inputs[0].address}
							</Link>
						) : (
							"COINBASE (Newly Generated Coins)"
						)}
					</span>
				</div>
				<div className="has-text-centered" style={{ width: "5em" }}>
					<i className="material-icons">arrow_right_alt</i>
				</div>
				<div className="" style={{ width: "" }}>
					<Link style={keyText} to={`/wallet/${transaction.outputs[0].address}`}>
						{transaction.outputs[0].address}
					</Link>
				</div>
				<div className="ml-auto">
					<span className="subtitle is-6">Amount: &nbsp;</span>
					<span className="title is-6">{transaction.outputs[0].amount ?? 0} BBC</span>
					<p>
						<span className="subtitle is-6">Fee: &nbsp;</span>
						<span className="title is-6">{transaction.fee ?? 0} BBC</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Transaction;
