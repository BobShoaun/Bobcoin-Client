import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Blockchain from "../../components/Blockchain";
import MineMempool from "./MineMempool";

import { addBlock } from "../../store/blockchainSlice";
import { getHighestValidBlock, mineNewBlock } from "blockchain-crypto";

const MinePage = () => {
	const dispatch = useDispatch();
	const blockchain = useSelector(state => state.blockchain);
	const transactions = useSelector(state => state.transactions);
	const [miner, setMiner] = useState("");
	// const [headBlock, setHeadBlock] = useState(getHighestValidBlock(blockchain));
	const [selectedTxMap, setSelectedTxMap] = useState({});

	const headBlock = getHighestValidBlock(blockchain);

	const startMining = () => {
		console.log("mining");
		const txToMine = transactions.filter(tx => selectedTxMap[tx.hash]);
		const block = mineNewBlock(headBlock, txToMine, miner);
		dispatch(addBlock(block));
	};

	const headBlockChanged = height => {
		// const prevBlock = this.props.blockchain.chain.find(block => block.height == height);
		// if (prevBlock == undefined) return;
		// this.setState({ prevBlock, mempool: this.props.blockchain.getMempool(prevBlock) });
	};

	return (
		<section className="section">
			<h1 className="title is-2">Mine</h1>
			<p className="subtitle is-4">
				From the comfort of your browser! No need for unnessasary mining clients.
			</p>
			<hr />

			<div className="field">
				<label className="label">Miner's Public key</label>
				<input
					onChange={({ target }) => setMiner(target.value)}
					className="input"
					type="text"
					placeholder="Input miner's key"
				></input>
				<p className="help">The public key of the miner, where to send block reward.</p>
			</div>

			<div className="field">
				<label className="label">Mine from block</label>
				<input className="input" type="text" placeholder="Enter block hash"></input>
				<p className="help">Which block to mine from.</p>
			</div>

			<div className="is-flex is-align-items-center mb-6">
				<div className="mr-2">
					<button onClick={() => startMining()} className="button mb-0">
						Start mining
					</button>
				</div>
				<div className="" style={{ overflow: "auto" }}>
					<Blockchain className=""></Blockchain>
				</div>
			</div>

			<h3 className="title is-4">Mempool</h3>
			<p className="subtitle">Select transactions to include from the mempool.</p>
			<hr />
			<MineMempool updateSelectedTransactions={txs => setSelectedTxMap(txs)}></MineMempool>
		</section>
	);
};

export default MinePage;
