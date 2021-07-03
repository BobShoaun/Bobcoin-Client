import React from "react";
import { Link } from "react-router-dom";

import { useParams } from "../hooks/useParams";

import ReactTooltip from "react-tooltip";
import { format } from "date-fns";

import { RESULT } from "blockcrypto";

const Transaction = ({ transactionInfo, block }) => {
	const [loading, params] = useParams();

	const {
		transaction,
		validation,
		totalInput,
		totalOutput,
		fee,
		isCoinbase,
		confirmations,
		inputInfo,
		outputSpent,
	} = transactionInfo;

	const getConfirmationColor = confirmations => {
		if (confirmations > params.blkMaturity) return "confirmations-8";
		return `confirmations-${confirmations}`;
	};

	return (
		<div className="">
			<div className="is-flex-tablet is-align-items-center mb-3">
				<div className="is-flex is-align-items-center">
					{validation.code === RESULT.VALID ? (
						<div className="icon mr-1">
							<i className="material-icons md-18">check_circle</i>
						</div>
					) : (
						<div className="icon has-text-danger mr-1">
							<i className="material-icons md-18">dangerous</i>
						</div>
					)}
					<h3 className="title is-6 mb-0">Hash: &nbsp;</h3>
				</div>
				<Link
					className="is-block truncated"
					to={
						block
							? `/transaction/${transaction.hash}?block=${block.hash}`
							: `/transaction/${transaction.hash}`
					}
				>
					{transaction.hash ?? "-"}
				</Link>
				<p style={{ flexShrink: 0 }} className="ml-auto pl-2 subtitle is-6 mb-0 has-text-right">
					{format(transaction.timestamp, "HH:mm d MMM yyyy")}
				</p>
			</div>

			<section className="is-flex-tablet mb-3" style={{ gap: "2em" }}>
				{isCoinbase ? (
					<p style={{ flex: "1" }}>COINBASE (Newly Minted Coins)</p>
				) : (
					<div className="is-flex truncated" style={{ flex: "1" }}>
						<div className="truncated">
							{inputInfo.map((info, index) => (
								<Link key={index} className="is-block truncated" to={`/address/${info.address}`}>
									{info.address}
								</Link>
							))}
						</div>

						<div className="ml-auto pl-2" style={{ whiteSpace: "nowrap" }}>
							{inputInfo.map((input, index) => (
								<div
									key={index}
									className="is-flex is-align-items-center is-justify-content-flex-end"
								>
									<p key={index} className="has-text-weight-medium has-text-right">
										{(input.amount / params.coin).toFixed(8)} {params.symbol}
									</p>
									<div data-tip data-for="tx-out" className="is-block ml-3">
										<Link
											className="is-block truncated"
											to={`/transaction/${transaction.inputs[index].txHash}`}
										>
											<span className="has-text-info material-icons-outlined md-18 is-block my-auto">
												credit_score
											</span>
										</Link>
										<ReactTooltip id="tx-out" type="info" effect="solid">
											<span>Tx output</span>
										</ReactTooltip>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				<div>
					<i className="material-icons md-28" style={{ lineHeight: "24px" }}>
						arrow_right_alt
					</i>
				</div>

				<div className="is-flex  truncated" style={{ flex: "1" }}>
					<div className="truncated">
						{transaction.outputs.map((output, index) => (
							<Link key={index} className="is-block truncated" to={`/address/${output.address}`}>
								{output.address}
							</Link>
						))}
					</div>
					<div className="ml-auto pl-2" style={{ whiteSpace: "nowrap" }}>
						{transaction.outputs.map((output, index) => (
							<div
								key={index}
								className="is-flex is-align-items-center is-justify-content-flex-end"
							>
								<p className="has-text-weight-medium has-text-right">
									{(output.amount / params.coin).toFixed(8)} {params.symbol}
								</p>
								{!outputSpent[index] ? (
									<a data-tip data-for="unspent" className="ml-3 is-block">
										<span className="has-text-success material-icons-outlined md-18 is-block my-auto">
											credit_card
										</span>
										<ReactTooltip id="unspent" type="dark" effect="solid">
											<span>Unspent output</span>
										</ReactTooltip>
									</a>
								) : (
									<a data-tip data-for="spent" className="is-block ml-3">
										<span className="has-text-danger material-icons-outlined md-18 is-block my-auto">
											credit_card_off
										</span>
										<ReactTooltip id="spent" type="error" effect="solid">
											<span>Spent output</span>
										</ReactTooltip>
									</a>
								)}
							</div>
						))}
					</div>
				</div>
			</section>
			<section className="is-flex is-flex-wrap-wrap">
				<div className="mt-auto">
					<span
						className={`subtitle is-6 is-inline-block mb-1 py-1 px-3 has-text-white ${getConfirmationColor(
							confirmations
						)}`}
						style={{ borderRadius: "0.3em" }}
					>
						{confirmations > 0 ? `${confirmations} Confirmations` : "Unconfirmed (Mempool)"}
					</span>
				</div>
				<div className="has-text-right ml-auto">
					<span
						className="title is-6 is-inline-block mb-1 py-1 px-3 has-background-dark has-text-white"
						style={{ borderRadius: "0.3em" }}
					>
						Amount = {(totalOutput / params.coin).toFixed(8)} {params.symbol}
					</span>
					{!isCoinbase && (
						<div>
							<span
								className="title is-6 is-inline-block mb-1 py-1 px-3"
								style={{ background: "lightgray", borderRadius: "0.3em" }}
							>
								Fee = {(fee / params.coin).toFixed(8)} {params.symbol}
							</span>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default Transaction;
