import React, { useMemo } from "react";

import { useParams } from "../../hooks/useParams";

import Transaction from "../../components/Transaction";

const MineMempool = ({ mempool, addTransaction, removeTransaction }) => {
	const toggleSelected = (value, tx) => {
		if (value) addTransaction(tx);
		else removeTransaction(tx);
	};

	// const mempoolInfo = useMemo(
	// 	() =>
	// 		mempool.map(({ transaction, inputs }) => ({
	// 			transaction,
	// 			inputs,
	// 			outputs: transaction.outputs.map(output => ({ ...output, spent: false })),
	// 		})),
	// 	[mempool]
	// );

	return (
		<div>
			{mempool.length ? (
				mempool.map(({ transaction, inputs, outputs }) => (
					<div key={transaction.hash} className="card mb-2">
						<div className="card-content is-flex">
							<div style={{ width: "2em" }}>
								<input
									className="tx is-clickable"
									onChange={({ target }) => toggleSelected(target.checked, transaction)}
									type="checkbox"
								></input>
							</div>

							<div style={{ width: "calc(100% - 2em)" }}>
								<Transaction
									isCoinbase={false}
									confirmations={0}
									transaction={transaction}
									inputs={inputs}
									outputs={outputs}
								></Transaction>
							</div>
						</div>
					</div>
				))
			) : (
				<div
					className="has-background-white mb-6 is-flex is-justify-content-center"
					style={{ padding: "2.5em" }}
				>
					<span className="material-icons-outlined mr-3 md-18">pending_actions</span>
					<p className="subtitle is-6 has-text-centered">
						There are currently no pending transactions...
					</p>
				</div>
			)}
		</div>
	);
};

export default MineMempool;
