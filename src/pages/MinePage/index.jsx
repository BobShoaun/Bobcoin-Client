import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Blockchain from "../../components/Blockchain/";
import MineMempool from "./MineMempool";
import MineSuccessModal from "./MineSuccessModal";
import MineFailureModal from "./MineFailureModal";

import { useBlockchain } from "../../hooks/useBlockchain";

import { addBlock } from "../../store/blockchainSlice";
import { addTransaction } from "../../store/transactionsSlice";
import {
	getHighestValidBlock,
	calculateBlockReward,
	addBlock as addBlockToBlockchain,
	isBlockchainValid,
	RESULT,
	bigIntToHex64,
	getTransactionFees,
	createOutput,
	createTransaction,
	calculateTransactionHash,
	createBlock,
	calculateHashTarget,
	isBlockValidInBlockchain,
} from "blockcrypto";

import Miner from "./miner.worker";
import SocketContext from "../../socket/SocketContext";

import Loading from "../../components/Loading";

import "./mine.css";

const MinePage = () => {
	const dispatch = useDispatch();
	const keys = useSelector(state => state.wallet.keys);

	const [miner, setMiner] = useState(keys.address);
	const [headBlock, setHeadBlock] = useState(null);
	const [terminalLog, setTerminalLog] = useState([]);
	const [successModal, setSuccessModal] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [error, setError] = useState({});
	const [selectedTxs, setSelectedTxs] = useState([]);
	const activeWorker = useRef(null);

	const [loading, params, blockchain, transactions] = useBlockchain();
	const { socket } = useContext(SocketContext);

	useEffect(() => {
		return () => {
			// terminate worker when leaving page / component
			console.log("terminating worker", activeWorker.current);
			activeWorker.current?.terminate();
		};
	}, []);

	useEffect(() => {
		if (blockchain.length) setHeadBlock(getHighestValidBlock(params, blockchain));
	}, [blockchain]);

	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	const isLatest = getHighestValidBlock(params, blockchain).hash === headBlock?.hash;

	const startMining = () => {
		if (activeWorker.current) {
			setTerminalLog(log => [
				...log,
				`\nAnother mining process is currently running, to terminate it type 'mine stop'.`,
			]);
			return;
		}

		const fees = selectedTxs.reduce((total, tx) => total + getTransactionFees(transactions, tx), 0);
		const output = createOutput(miner, calculateBlockReward(params, headBlock.height + 1) + fees);
		const coinbase = createTransaction(params, [], [output]);
		coinbase.hash = calculateTransactionHash(coinbase);

		const block = createBlock(params, blockchain, headBlock, [coinbase, ...selectedTxs]);
		const target = calculateHashTarget(params, block);

		// validate b4 starting to mine
		const blockchainCopy = [...blockchain];
		addBlockToBlockchain(blockchainCopy, block);
		let validation = null;
		try {
			validation = isBlockValidInBlockchain(params, blockchainCopy, block, true);
		} catch (e) {
			console.log(e);
			setErrorModal(true);
			return;
		}
		if (validation.code !== RESULT.VALID) {
			console.error("Block is invalid, not broadcasting...: ", block);
			setError(validation);
			setErrorModal(true);
			return;
		}

		setTerminalLog(log => [
			...log,
			`\nMining started...\nprevious block: ${headBlock.hash}\ntarget hash: ${bigIntToHex64(
				target
			)}\n `,
		]);

		const worker = new Miner();
		worker.postMessage({ block, target });
		activeWorker.current = worker;

		worker.addEventListener("message", async ({ data }) => {
			switch (data.message) {
				case "nonce":
					setTerminalLog(log => [...log, `nonce reached: ${data.block.nonce}`]);
					break;

				case "success":
					setTerminalLog(log => [
						...log,
						`\nMining successful! New block mined with...\nhash: ${data.block.hash}\nnonce: ${data.block.nonce}`,
					]);
					activeWorker.current = null;

					const blockchainCopy = [...blockchain];
					const block = data.block;
					addBlockToBlockchain(blockchainCopy, block);

					const validation = isBlockchainValid(params, blockchainCopy, block);
					if (validation.code !== RESULT.VALID) {
						console.error("Block is invalid, not broadcasting...: ", block);
						setError(validation);
						setErrorModal(true);
						break;
					}

					dispatch(addTransaction(coinbase));
					dispatch(addBlock(block));
					socket.emit("block", block);
					setSuccessModal(true);

					if (Notification.permission !== "denied")
						// ask user for permission
						await Notification.requestPermission();

					if (Notification.permission === "granted") {
						const notification = new Notification("Bobcoins mined!", {
							body: "You have successfully mined a block",
							// icon:
						});
						notification.onclick = () => window.focus();
					}
					break;
				default:
					console.error("invalid worker case");
			}
		});
	};

	const stopMining = () => {
		if (activeWorker.current) {
			activeWorker.current.terminate();
			activeWorker.current = null;
			setTerminalLog(log => [...log, `\nMining operation stopped.`]);
			return;
		}
		setTerminalLog(log => [...log, `\nNo mining processes running.`]);
	};

	const submitCommand = event => {
		event.preventDefault();
		const command = event.target.command.value;
		event.target.command.value = "";
		switch (command) {
			case "mine start":
				startMining();
				break;
			case "mine stop":
				stopMining();
				break;
			case "help":
				setTerminalLog(log => [
					...log,
					`\nCrappy ${params.name} mining terminal v1.0.0-beta\n\nList of commands:\nmine start\nmine stop\nhelp`,
				]);
				break;
			default:
				setTerminalLog(log => [...log, `\nunknown command: ${command}, type 'help' for help.`]);
		}
	};

	return (
		<section className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Mine</h1>
			<p className="subtitle is-size-6 is-size-5-tablet">
				From the comfort of your browser! No need for unnessasary mining clients.
			</p>

			<div className="mb-6">
				<Blockchain
					selectedBlock={headBlock}
					setSelectedBlock={block => activeWorker.current || setHeadBlock(block)}
				/>
			</div>

			<section className="is-flex-tablet mb-5" style={{ gap: "3em" }}>
				<section className="terminal mb-5" style={{ flex: "1 0 10em" }}>
					<div className="mt-auto content" style={{ width: "100%" }}>
						{terminalLog.map((log, index) => (
							<pre className="terminal-output" key={index}>
								{log}
							</pre>
						))}
						<div className="is-flex is-align-items-center">
							<span className="mr-2 has-text-weight-bold">&gt;</span>
							<form onSubmit={submitCommand} className="is-block" style={{ width: "100%" }}>
								<input
									className="terminal-input"
									name="command"
									type="text"
									autoComplete="off"
									style={{ width: "100%" }}
								/>
							</form>
						</div>
					</div>
				</section>
				<section className="mb-6" fstyle={{ flexBasis: "40%" }}>
					<div className="field mb-4">
						<label className="label">Miner's Address</label>
						<div className="field has-addons mb-0">
							<div className="control is-expanded">
								<input
									onChange={({ target }) => setMiner(target.value)}
									value={miner}
									className="input"
									type="text"
									placeholder="Input miner's key"
								/>
							</div>
							<p className="control">
								<button
									onClick={async () => setMiner(await navigator.clipboard.readText())}
									className="button"
								>
									<i className="material-icons md-18">content_paste</i>
								</button>
							</p>
						</div>
						<p className="help">The address of the miner, where to send block reward and fees.</p>
					</div>

					<div className="field mb-5">
						<label className="label">Head block</label>
						<input
							value={headBlock?.hash ?? "-"}
							className="input"
							type="text"
							placeholder="Enter block hash"
							readOnly
						></input>
						<p className="help">Previous block to mine from.</p>
						{!isLatest && (
							<p className="help is-danger is-flex">
								<span className="material-icons-outlined md-18 mr-2">warning</span>You are not
								mining from the latest block.
							</p>
						)}
					</div>

					<button onClick={activeWorker.current ? stopMining : startMining} className="button mb-0">
						<i className="material-icons mr-2">engineering</i>
						{activeWorker.current ? "Stop mining" : "Start mining"}
					</button>
				</section>
			</section>

			<h3 className="title is-4">Mempool</h3>
			<p className="subtitle is-6 mb-4">Select transactions to include from the mempool.</p>
			<MineMempool
				headBlock={headBlock}
				addTransaction={tx => setSelectedTxs(txs => [...txs, tx])}
				removeTransaction={tx => setSelectedTxs(txs => txs.filter(tx2 => tx2.hash !== tx.hash))}
			/>

			<MineSuccessModal
				isOpen={successModal}
				close={() => setSuccessModal(false)}
				params={params}
				blockReward={(calculateBlockReward(params, headBlock?.height + 1) / params.coin).toFixed(8)}
			/>

			<MineFailureModal isOpen={errorModal} close={() => setErrorModal(false)} error={error} />
		</section>
	);
};

export default MinePage;
