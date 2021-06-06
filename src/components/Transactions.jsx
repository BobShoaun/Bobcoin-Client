import React from "react";
import Transaction from "./Transaction";

const Transactions = ({ transactions, block }) => (
	<div>
		{transactions?.map(transaction => (
			<div key={transaction.hash} className="card mb-2">
				<div className="card-content">
					<Transaction transaction={transaction} block={block}></Transaction>
				</div>
			</div>
		))}
	</div>
);

export default Transactions;
