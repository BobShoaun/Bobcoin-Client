import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Transaction from "./Transaction";

import { calculateMempool, getHighestValidBlock } from "blockcrypto";

const Mempool = () => {
	const transactions = useSelector(state => state.transactions);
	const blockchain = useSelector(state => state.blockchain.chain);
	const [mempool, setMempool] = useState([]);

	useEffect(() => {
		if (blockchain.length)
			setMempool(calculateMempool(blockchain, getHighestValidBlock(blockchain), transactions));
	}, [transactions, blockchain]);

	return (
		<div>
			{mempool.map(transaction => (
				<div key={transaction.hash} className="card card-content mb-2">
					<Transaction transaction={transaction}></Transaction>
				</div>
			))}
		</div>
	);
};

export default Mempool;
