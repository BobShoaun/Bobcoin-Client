import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import MineBlockchain from "./MineBlockchain";
import MineMempool from "./MineMempool";

import { newBlock } from "../../store/blockchainSlice";
import { getHighestValidBlock, mineNewBlock } from "blockchain-crypto";

import "./mine.css";

const MinePage = () => {
	const dispatch = useDispatch();
	const blockchain = useSelector(state => state.blockchain);
	const transactions = useSelector(state => state.transactions);
	const [miner, setMiner] = useState(localStorage.getItem("pk"));
	const [headBlock, setHeadBlock] = useState(getHighestValidBlock(blockchain));
	const [selectedTxMap, setSelectedTxMap] = useState({});
	const [terminalLog, setTerminalLog] = useState([]);

	useEffect(() => {
		setHeadBlock(getHighestValidBlock(blockchain));
	}, [blockchain]);

	const startMining = () => {
		setTerminalLog(log => [...log, `Mining started from block: ${headBlock.hash}`]);

		const txToMine = transactions.filter(tx => selectedTxMap[tx.hash]);
		const block = mineNewBlock(headBlock, txToMine, miner);
		dispatch(newBlock(block));

		setTerminalLog(log => [...log, "Mining successful!"]);
	};

	const submitCommand = event => {
		event.preventDefault();
		const command = event.target.command.value;
		event.target.command.value = "";
		switch (command) {
			case "mine start":
				startMining();
				break;
			default:
				setTerminalLog(log => [...log, "invalid command: " + command]);
		}
	};

	return (
		<section className="section">
			<h1 className="title is-2">Mine</h1>
			<p className="subtitle is-4">
				From the comfort of your browser! No need for unnessasary mining clients.
			</p>
			<hr />

			<div className="mb-5" style={{ overflow: "auto" }}>
				<MineBlockchain selectBlock={setHeadBlock}></MineBlockchain>
			</div>

			<section className="is-flex mb-6">
				<section className="terminal mr-6" style={{ width: "60%" }}>
					<div className="mt-auto" style={{ width: "100%" }}>
						{terminalLog.map((log, index) => (
							<p className="mb-2" key={index}>
								{log}
							</p>
						))}
						<div className="is-flex is-align-items-center">
							<span className="mr-2">&gt;</span>
							<form onSubmit={submitCommand} className="is-block" style={{ width: "100%" }}>
								<input
									className="terminal-input"
									name="command"
									type="text"
									autocomplete="off"
									style={{ width: "100%" }}
								/>
							</form>
						</div>
					</div>
				</section>
				<section style={{ width: "40%" }}>
					<div className="field mb-4">
						<label className="label">Miner's Public key</label>
						<input
							onChange={({ target }) => setMiner(target.value)}
							value={miner}
							className="input"
							type="text"
							placeholder="Input miner's key"
						></input>
						<p className="help">The public key of the miner, where to send block reward.</p>
					</div>

					<div className="field mb-5">
						<label className="label">Head block</label>
						<input
							value={headBlock.hash}
							className="input"
							type="text"
							placeholder="Enter block hash"
							readOnly
						></input>
						<p className="help">Which block to mine from.</p>
					</div>

					<button onClick={startMining} className="button mb-0">
						Start mining
					</button>
				</section>
			</section>

			<h3 className="title is-4">Mempool</h3>
			<p className="subtitle">Select transactions to include from the mempool.</p>
			<hr />
			<MineMempool
				headBlock={headBlock}
				updateSelectedTransactions={txs => setSelectedTxMap(txs)}
			></MineMempool>
		</section>
	);
};

export default MinePage;
