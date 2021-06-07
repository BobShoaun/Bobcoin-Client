import React from "react";
import { useSelector } from "react-redux";
import Transaction from "./Transaction";

import { calculateMempool, getHighestValidBlock } from "blockcrypto";

const Mempool = () => {
	const transactions = useSelector(state => state.transactions.txs);
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.consensus.params);
	const txFetched = useSelector(state => state.transactions.fetched);
	const blockchainFetched = useSelector(state => state.blockchain.fetched);
	const paramsFetched = useSelector(state => state.consensus.fetched);

	const loading = !txFetched || !blockchainFetched || !paramsFetched;
	if (loading) return null;

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
				<div className="py-6">
					<p className="subtitle is-6 has-text-centered">There are no pending transactions...</p>
				</div>
			)}
		</div>
	);
};

export default Mempool;
