import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Transaction from "./Transaction";

import axios from "axios";

const Mempool = () => {
	const api = useSelector(state => state.blockchain.api);
	const [mempool, setMempool] = useState([]);

	const getMempool = async () => {
		const mem = (await axios.get(`${api}/transaction/mempool`)).data;
		setMempool(mem);
	};

	useEffect(() => getMempool(), [api]);

	return (
		<div>
			{mempool.length ? (
				mempool.map(transactionInfo => (
					<div key={transactionInfo.transaction.hash} className="card mb-2">
						<div className="card-content">
							<Transaction transactionInfo={transactionInfo} />
						</div>
					</div>
				))
			) : (
				<div
					className="has-background-white mb-6 is-flex is-justify-content-center"
					style={{ padding: "2.5em" }}
				>
					<span className="material-icons-outlined mr-3 md-18">pending_actions</span>
					<p className="subtitle is-6 has-text-centered">There are no pending transactions...</p>
				</div>
			)}
		</div>
	);
};

export default Mempool;
