import React from "react";
import Transaction from "./Transaction";
import { useMempool } from "../hooks/useMempool";

const Mempool = () => {
	const [mempoolLoading, mempool] = useMempool();

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
			{mempool.map(({ transaction, inputs, outputs }) => (
				<div key={transaction.hash} className="card mb-2">
					<div className="card-content">
						<Transaction
							isCoinbase={false}
							confirmations={0}
							transaction={transaction}
							inputs={inputs}
							outputs={outputs}
						/>
					</div>
				</div>
			))}
		</main>
	);
};

export default Mempool;
