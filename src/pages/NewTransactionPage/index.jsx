import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { useBlockchain } from "../../hooks/useBlockchain";

import { addTransaction } from "../../store/transactionsSlice";
import {
	getKeys,
	getHighestValidBlock,
	calculateMempoolUTXOSet,
	createInput,
	createOutput,
	createTransaction,
	signTransaction,
	calculateTransactionHash,
	isTransactionValid,
	RESULT,
} from "blockcrypto";
import TransactionFailureModal from "./TransactionFailureModal";
import TransactionSuccessModal from "./TransactionSuccessModal";

import SocketContext from "../../socket/SocketContext";

const NewTransactionPage = () => {
	const dispatch = useDispatch();
	const keys = useSelector(state => state.wallet.keys);

	const history = useHistory();

	const [showSK, setShowSK] = useState(false);
	const [amount, setAmount] = useState("");
	const [fee, setFee] = useState("");
	const [senderSK, setSenderSK] = useState(keys.sk);
	const [senderPK, setSenderPK] = useState("");
	const [senderAdd, setSenderAdd] = useState("");
	const [recipientAdd, setRecipientAdd] = useState("");

	const [confirmModal, setConfirmModal] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [error, setError] = useState({});

	const { socket } = useContext(SocketContext);

	const [loading, params, blockchain, transactions] = useBlockchain();

	useEffect(() => {
		try {
			const { pk, address } = getKeys(params, senderSK);
			setSenderPK(pk);
			setSenderAdd(address);
		} catch {
			setSenderSK("");
			setSenderPK("");
			setSenderAdd("");
		}
	}, [senderSK]);

	if (loading) return null;
	const handleSenderKeyChange = senderSK => {
		try {
			const { sk, pk, address } = getKeys(params, senderSK);
			setSenderSK(sk);
			setSenderPK(pk);
			setSenderAdd(address);
		} catch {
			setSenderSK("");
			setSenderPK("");
			setSenderAdd("");
		}
	};

	const handleAmountChange = amount => {
		let amt = parseFloat(amount);
		const places =
			Math.floor(amt.valueOf()) === amt.valueOf() ? 0 : amount.split(".")[1]?.length || 0;
		if (places > 8) amt = amt.toFixed(8);
		setAmount(isNaN(amt) ? "" : amt);
	};

	const handleFeeChange = amount => {
		let amt = parseFloat(amount);
		const places =
			Math.floor(amt.valueOf()) === amt.valueOf() ? 0 : amount.split(".")[1]?.length || 0;
		if (places > 8) amt = amt.toFixed(8);
		setFee(isNaN(amt) ? "" : amt);
	};

	const createAndSignTransaction = () => {
		const _amount = Math.trunc(amount * params.coin);
		const _fee = Math.trunc(fee * params.coin);

		const headBlock = getHighestValidBlock(params, blockchain);

		// get utxos from mempool
		const utxoSet = calculateMempoolUTXOSet(blockchain, headBlock, transactions);

		// pick utxos from front to back.
		let inputAmount = 0;
		const inputs = [];
		for (const utxo of utxoSet) {
			if (inputAmount >= _amount) break;
			if (utxo.address !== senderAdd) continue;
			inputAmount += utxo.amount;
			const input = createInput(utxo.txHash, utxo.outIndex, senderPK);
			inputs.push(input);
		}

		const outputs = [];
		const payment = createOutput(recipientAdd, _amount);
		outputs.push(payment);

		const changeAmount = inputAmount - _amount - _fee;
		if (changeAmount > 0) {
			const change = createOutput(senderAdd, changeAmount);
			outputs.push(change);
		}

		const transaction = createTransaction(params, inputs, outputs);
		const signature = signTransaction(transaction, senderSK);
		transaction.inputs.forEach(input => (input.signature = signature));

		transaction.hash = calculateTransactionHash(transaction);

		const validation = isTransactionValid(params, transactions, transaction);
		if (validation.code !== RESULT.VALID) {
			setError(validation);
			setErrorModal(true);
			console.error(validation);
			return;
		}

		dispatch(addTransaction(transaction));
		socket.emit("transaction", transaction);
		setConfirmModal(true);
	};

	return (
		<section className="section">
			<h1 className="title is-2">New Transaction</h1>
			<p className="subtitle is-5">Create, sign and broadcast a new transaction.</p>

			<div className="field mb-4">
				<label className="label">Sender's Private key</label>
				<div className="field has-addons mb-0">
					<div className="control is-expanded">
						<input
							className="input"
							type={showSK ? "text" : "password"}
							placeholder="Enter private key"
							value={senderSK}
							onChange={({ target: { value } }) => handleSenderKeyChange(value)}
						></input>
					</div>
					<p className="control">
						<button onClick={() => setShowSK(showSK => !showSK)} className="button">
							<i className="material-icons md-18">{showSK ? "visibility_off" : "visibility"}</i>
						</button>
					</p>
				</div>
				<p className="help">You can only spend from an address which you have the private key.</p>
			</div>

			<div className="field mb-4">
				<label className="label">Sender's Public key</label>
				<input
					value={senderPK}
					className="input"
					type="text"
					placeholder="Input private key above to get public key"
					readOnly
				></input>
				<p className="help">
					The public key of the sender generated from the private key above. (read only)
				</p>
			</div>

			<div className="field mb-4">
				<label className="label">Sender's Address</label>
				<input
					value={senderAdd}
					className="input"
					type="text"
					placeholder="Input private key above to get address"
					readOnly
				></input>
				<p className="help">
					The address of the sender generated from the public key above. (read only)
				</p>
			</div>

			<div className="field mb-5">
				<label className="label">Recipient's Address</label>
				<div className="field has-addons mb-0">
					<div className="control is-expanded">
						<input
							className="input"
							type="text"
							placeholder="Enter Address"
							value={recipientAdd}
							onChange={({ target: { value } }) => setRecipientAdd(value)}
						></input>
					</div>
					<p className="control">
						<button
							onClick={async () => setRecipientAdd(await navigator.clipboard.readText())}
							className="button"
						>
							<i className="material-icons md-18">content_paste</i>
						</button>
					</p>
				</div>
				{/* <p className="help">The public key of the recipient of this transaction.</p> */}
			</div>

			<div className="is-flex mb-6">
				<div className="field mr-5" style={{ flexGrow: 1 }}>
					<label className="label">Amount ({params.symbol})</label>
					<input
						className="input"
						onChange={({ target }) => handleAmountChange(target.value)}
						value={amount}
						type="number"
						min="0"
						step=".01"
						placeholder="0.00000000"
					/>
				</div>

				<div className="field" style={{ flexGrow: 1 }}>
					<label className="label">Fee ({params.symbol})</label>
					<input
						className="input"
						onChange={({ target }) => handleFeeChange(target.value)}
						value={fee}
						type="number"
						min="0"
						step=".01"
						placeholder="0.00000000"
					/>
				</div>
			</div>

			<div className="buttons is-pulled-right">
				<button onClick={history.goBack} className="button">
					Cancel
				</button>
				<button
					className="button is-link has-text-weight-semibold"
					onClick={createAndSignTransaction}
				>
					<span className="material-icons-outlined mr-2">payments</span>
					Create & Sign
				</button>
			</div>
			<div className="is-clearfix"></div>

			<TransactionSuccessModal isOpen={confirmModal} close={() => setConfirmModal(false)} />
			<TransactionFailureModal
				isOpen={errorModal}
				close={() => setErrorModal(false)}
				error={error}
			/>
		</section>
	);
};

export default NewTransactionPage;
