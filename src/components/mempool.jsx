import React from "react";
import { useSelector } from "react-redux";
import Transaction from "./Transaction";

const Mempool = () => {
	const transactions = useSelector(state => state.transactions);
	return (
		<div>
			{transactions.map(transaction => (
				<div key={transaction.hash} className="mb-2">
					<Transaction transaction={transaction}></Transaction>
				</div>
			))}
		</div>
	);
};

export default Mempool;
