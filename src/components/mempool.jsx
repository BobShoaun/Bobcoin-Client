import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Transaction from "./Transaction";

import { calculateMempool, getHighestValidBlock } from "blockcrypto";

const Mempool = () => {
	const transactions = useSelector(state => state.transactions);
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.blockchain.params);
	const [mempool, setMempool] = useState([]);

	useEffect(() => {
		if (blockchain.length)
			setMempool(calculateMempool(blockchain, getHighestValidBlock(blockchain), transactions));
	}, [transactions, blockchain]);

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
					<p className="subtitle is-6 has-text-centered">
						There are currently no pending transactions, looks like {params.name} ain't going to the
						moon.
					</p>
				</div>
			)}
		</div>
	);
};

export default Mempool;
