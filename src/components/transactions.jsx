import React from "react";
import Transaction from "./Transaction";

const Transactions = ({ transactions }) => (
	<div>
		{transactions?.map(transaction => (
			<div key={transaction.hash} className="mb-2">
				<Transaction transaction={transaction}></Transaction>
			</div>
		))}
	</div>
);

export default Transactions;
