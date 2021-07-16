import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Loading from "../../components/Loading";
import "./index.css";

import { useParams as useConsensus } from "../../hooks/useParams";
import { useMempool } from "../../hooks/useMempool";

import Transaction from "../../components/Transaction";

import axios from "axios";

const SummaryTab = () => {
	const [loadingParams, params] = useConsensus();
	const [loadingMempool, mempool] = useMempool();

	const address = "8UVo1jeAhigidZo3zamQzdjZfqA3YBm";

	const api = useSelector(state => state.network.api);

	const [addressInfo, setAddressInfo] = useState(null);

	useEffect(async () => {
		setAddressInfo(null);
		const result = await axios.get(`${api}/address/${address}`);
		setAddressInfo(result.data);
	}, [api, address]);

	const loading = !addressInfo || loadingParams || loadingMempool;

	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	const { utxos, transactionsInfo } = addressInfo;
	const balance = utxos.reduce((total, utxo) => total + utxo.amount, 0);

	return (
		<main>
			<div className="is-flex-tablet is-align-items-start mb-5" style={{ gap: "2em" }}>
				<div className="card">
					<div className="card-content px-6">
						<h3 className="title is-6">Balance: </h3>
						<p className="subtitle has-text-weight-light is-1">
							{(balance / params.coin).toFixed(8)}
							<span className="has-text-weight-medium is-size-3 ml-2">{params.symbol}</span>
						</p>
					</div>
				</div>
			</div>
			<h1 className="title is-size-5 is-size-4-tablet mb-3">Pending transactions</h1>
			<div className="mb-6">
				{mempool.map(({ transaction, inputs, outputs }) => (
					<div key={transaction.hash} className="card mb-3">
						<div className="card-content">
							<Transaction transaction={transaction} inputs={inputs} outputs={outputs} />
						</div>
					</div>
				))}
			</div>

			<h1 className="title is-size-5 is-size-4-tablet mb-3">Transactions</h1>
			<div className="mb-6">
				{transactionsInfo.length ? (
					transactionsInfo
						.sort((a, b) => b.transaction.timestamp - a.transaction.timestamp)
						.map(({ transaction, inputs, outputs }) => (
							<div key={transaction.hash} className="card mb-3">
								<div className="card-content">
									<Transaction transaction={transaction} inputs={inputs} outputs={outputs} />
								</div>
							</div>
						))
				) : (
					<div className="has-background-white py-4">
						<p className="subtitle is-6 has-text-centered">
							The address has not sent or received{" "}
							<span className="is-lowercase">{params.name}</span>s.
						</p>
					</div>
				)}
			</div>
		</main>
	);
};

export default SummaryTab;
