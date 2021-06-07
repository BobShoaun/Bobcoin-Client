import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ReactTooltip from "react-tooltip";

import {
	isTransactionValid,
	isCoinbaseTxValid,
	getBlockConfirmations,
	RESULT,
	getHighestValidBlock,
	calculateUTXOSet,
} from "blockcrypto";

const Transaction = ({ transaction, block, headBlock }) => {
	const params = useSelector(state => state.consensus.params);
	const blockchain = useSelector(state => state.blockchain.chain);
	const blockchainFetched = useSelector(state => state.blockchain.fetched);
	const transactions = useSelector(state => state.transactions.txs);
	const txsFetched = useSelector(state => state.transactions.fetched);

	if (!txsFetched || !blockchainFetched) return null;

	const findTxo = input => {
		const tx = transactions.find(tx => tx.hash === input.txHash);
		const output = tx.outputs[input.outIndex];
		return output;
	};

	const isCoinbase = transaction.inputs.length === 0 && transaction.outputs.length === 1;
	const totalInputAmount = transaction.inputs.reduce(
		(total, input) => total + findTxo(input).amount,
		0
	);
	const totalOutputAmount = transaction.outputs.reduce((total, output) => total + output.amount, 0);
	const fee = totalInputAmount - totalOutputAmount;

	const isValid =
		(isCoinbase ? isCoinbaseTxValid(params, transaction) : isTransactionValid(params, transaction))
			.code === RESULT.VALID;

	const inMempool = !block;
	const confirmations = block ? getBlockConfirmations(blockchain, block) : 0;
	const head = headBlock ?? getHighestValidBlock(params, blockchain);

	const utxos = calculateUTXOSet(blockchain, head);

	return (
		<div className="">
			<div className="is-flex is-align-items-center mb-1">
				{isValid ? (
					<div className="icon mr-2">
						<i className="material-icons md-18">check_circle</i>
					</div>
				) : (
					<div className="icon has-text-danger mr-2">
						<i className="material-icons md-18">dangerous</i>
					</div>
				)}
				<h3 className="title is-6 mb-0">Hash: &nbsp;</h3>
				<Link
					to={
						block
							? `/transaction/${transaction.hash}?block=${block.hash}`
							: `/transaction/${transaction.hash}`
					}
				>
					<p className="subtitle is-6 mb-0"> {transaction.hash ?? "no hash"}</p>
				</Link>
				<p className="ml-auto subtitle is-6 mb-0">
					{new Date(transaction.timestamp).toUTCString()}
				</p>
			</div>

			{/* {normalTransaction && (
				<div className="is-flex is-justify-content-start is-align-items-baseline mb-2">
					<h3 className="title is-6 mb-0">Signature: &nbsp;</h3>
					<p style={signatureText} className="subtitle is-6 mb-0">
						{transaction.signature}
					</p>
				</div>
			)} */}

			<div className="is-flex mb-2">
				{isCoinbase ? (
					<p>COINBASE (Newly Minted Coins)</p>
				) : (
					<div>
						{transaction.inputs.map((input, index) => {
							const txo = findTxo(input);
							return (
								<Link key={index} className="is-block" to={`/address/${txo.address}`}>
									{txo.address}
								</Link>
							);
						})}
					</div>
				)}
				{!isCoinbase && (
					<div className="ml-auto">
						{transaction.inputs.map((input, index) => (
							<p key={index} className="has-text-weight-medium has-text-right">
								{(findTxo(input).amount / params.coin).toFixed(8)} {params.symbol}
							</p>
						))}
					</div>
				)}
				<div className="has-text-centered" style={{ width: "5em" }}>
					<i className="material-icons md-28" style={{ lineHeight: "24px" }}>
						arrow_right_alt
					</i>
				</div>
				<div>
					{transaction.outputs.map((output, index) => (
						<Link key={index} className="is-block" to={`/address/${output.address}`}>
							{output.address}
						</Link>
					))}
				</div>
				<div className="ml-auto" style={{ width: "" }}>
					{transaction.outputs.map((output, index) => (
						<div key={index} className="is-flex is-align-items-center is-justify-content-flex-end">
							<p className="has-text-weight-medium has-text-right">
								{(output.amount / params.coin).toFixed(8)} {params.symbol}
							</p>
							{utxos.some(
								utxo =>
									utxo.address === output.address &&
									utxo.amount === output.amount &&
									utxo.txHash === transaction.hash &&
									utxo.outIndex === index
							) || inMempool ? (
								<a data-tip data-for="unspent">
									<span className="has-text-success material-icons-outlined ml-2 md-18 is-block my-auto">
										credit_card
									</span>
									<ReactTooltip id="unspent" type="dark" effect="solid">
										<span>Unspent output</span>
									</ReactTooltip>
								</a>
							) : (
								<a data-tip data-for="spent">
									<span className="has-text-danger material-icons-outlined ml-2 md-18 is-block my-auto">
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
			<section className="is-flex">
				<div className="mt-auto">
					<span
						className={`subtitle is-6 is-inline-block mb-1 py-1 px-3  has-text-white ${
							confirmations < params.blkMaturity
								? "has-background-warning"
								: "has-background-success"
						}`}
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
						Amount = {(totalOutputAmount / params.coin).toFixed(8)} {params.symbol}
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
