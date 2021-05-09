import React, { useState } from "react";
import { useSelector } from "react-redux";

import Transaction from "../../components/Transaction";

const MineMempool = ({ updateSelectedTransactions }) => {
	const transactions = useSelector(state => state.transactions);
	const [selectedTxMap, setSelectedTxMap] = useState({});

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
			{transactions.map(transaction => (
				<div
					// onClick={() => handleChecked(transaction)}
					key={transaction.hash}
					className="card card-content is-flex is-clickable mb-2"
				>
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
			))}
		</div>
	);
};

export default MineMempool;
