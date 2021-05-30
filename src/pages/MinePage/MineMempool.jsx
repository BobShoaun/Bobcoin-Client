import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { calculateMempool } from "blockcrypto";
import Transaction from "../../components/Transaction";

const MineMempool = ({ headBlock, updateSelectedTransactions }) => {
	const transactions = useSelector(state => state.transactions);
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.blockchain.params);
	const [selectedTxMap, setSelectedTxMap] = useState({});
	const [mempool, setMempool] = useState([]);

	useEffect(() => {
		if (headBlock) setMempool(calculateMempool(blockchain, headBlock, transactions));
	}, [blockchain]);

	const handleChecked = tx => {
		if (tx.hash in selectedTxMap)
			setSelectedTxMap(txMap => {
				txMap[tx.hash] = !txMap[tx.hash];
				return txMap;
			});
		else
			setSelectedTxMap(txMap => {
				txMap[tx.hash] = true;
				return txMap;
			});
		console.log(selectedTxMap);
		updateSelectedTransactions(selectedTxMap);
	};

	return (
		<div>
			{mempool.length ? (
				mempool.map(transaction => (
					<div
						// onClick={() => handleChecked(transaction)}
						key={transaction.hash}
						className="card is-clickable mb-2"
					>
						<div className="card-content is-flex">
							<div className="mr-4">
								<input
									// checked={selectedTxMap[transaction.hash]}
									onChange={() => handleChecked(transaction)}
									type="checkbox"
								></input>
							</div>

							<div style={{ flex: "1" }}>
								<Transaction transaction={transaction}></Transaction>
							</div>
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

export default MineMempool;
