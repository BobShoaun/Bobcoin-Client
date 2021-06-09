import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { calculateMempool } from "blockcrypto";
import Transaction from "../../components/Transaction";

const MineMempool = ({ headBlock, updateSelectedTransactions }) => {
	const transactions = useSelector(state => state.transactions.txs);
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.consensus.params);
	const [selectedTxMap, setSelectedTxMap] = useState({});
	const [mempool, setMempool] = useState([]);

	useEffect(() => {
		if (headBlock) setMempool(calculateMempool(blockchain, headBlock, transactions));
	}, [blockchain, headBlock, transactions]);

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
				<div className="card mb-6 is-flex is-justify-content-center" style={{ padding: "2.5em" }}>
					<span className="material-icons-outlined mr-3 md-18">pending_actions</span>
					<p className="subtitle is-6 has-text-centered">
						There are currently no pending transactions, looks like {params.name} ain't going to
						Mars.
					</p>
				</div>
			)}
		</div>
	);
};

export default MineMempool;
