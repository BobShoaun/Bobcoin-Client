import React, { useMemo } from "react";
import { useBlockchain } from "../../hooks/useBlockchain";

import { calculateMempool } from "blockcrypto";
import Transaction from "../../components/Transaction";

const MineMempool = ({ headBlock, addTransaction, removeTransaction }) => {
	const [loading, params, blockchain, transactions] = useBlockchain();

	const mempool = useMemo(
		() => (headBlock ? calculateMempool(blockchain, headBlock, transactions) : []),
		[blockchain, transactions, headBlock]
	);

	if (loading) return null;

	const toggleSelected = (value, tx) => {
		if (value) addTransaction(tx);
		else removeTransaction(tx);
	};

	return (
		<div>
			{mempool.length ? (
				mempool.map(transaction => (
					<div key={transaction.hash} className="card mb-2">
						<div className="card-content is-flex">
							<div className="mr-5">
								<input
									className="tx is-clickable"
									onChange={({ target }) => toggleSelected(target.checked, transaction)}
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
