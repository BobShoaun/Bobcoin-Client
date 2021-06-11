import React from "react";
import Transaction from "./Transaction";

import { useBlockchain } from "../hooks/useBlockchain";

import { calculateMempool, getHighestValidBlock } from "blockcrypto";

const Mempool = () => {
	const [loading, params, blockchain, transactions] = useBlockchain();
	if (loading || !blockchain.length || !transactions.length) return null;

	const mempool = calculateMempool(
		blockchain,
		getHighestValidBlock(params, blockchain),
		transactions
	);

	return (
		<div>
			{mempool.length ? (
				mempool.map(transaction => (
					<div key={transaction.hash} className="card mb-2">
						<div className="card-content">
							<Transaction transaction={transaction}></Transaction>
						</div>
					</div>
				))
			) : (
				<div className="card mb-6 is-flex is-justify-content-center" style={{ padding: "2.5em" }}>
					<span className="material-icons-outlined mr-3 md-18">pending_actions</span>
					<p className="subtitle is-6 has-text-centered">There are no pending transactions...</p>
				</div>
			)}
		</div>
	);
};

export default Mempool;
