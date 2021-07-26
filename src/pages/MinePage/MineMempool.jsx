import React from "react";

import Transaction from "../../components/Transaction";
import { useMempool } from "../../hooks/useMempool";

const MineMempool = ({ addTransaction, removeTransaction }) => {
	const [mempoolLoading, mempool] = useMempool();

	const toggleSelected = (value, tx) => {
		if (value) addTransaction(tx);
		else removeTransaction(tx);
	};

	if (mempoolLoading)
		return (
			<main
				className="has-background-white mb-6 is-flex is-justify-content-center"
				style={{ padding: "2.5em" }}
			>
				<span className="material-icons-outlined mr-3 md-18">sync</span>
				<p className="subtitle is-6 has-text-centered">Loading...</p>
			</main>
		);

	if (!mempool.length)
		return (
			<main
				className="has-background-white mb-6 is-flex is-justify-content-center"
				style={{ padding: "2.5em" }}
			>
				<span className="material-icons-outlined mr-3 md-18">pending_actions</span>
				<p className="subtitle is-6 has-text-centered">
					There are currently no pending transactions...
				</p>
			</main>
		);

	return (
		<main>
			{mempool.map(transaction => (
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
							<Transaction transaction={transaction} />
						</div>
					</div>
				</div>
			))}
		</main>
	);
};

export default MineMempool;
