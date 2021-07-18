import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	deriveKeys,
	createInput,
	createOutput,
	createTransaction,
	signTransactionHex,
	calculateTransactionHash,
	RESULT,
} from "blockcrypto";
import { addInternalKeys } from "../../store/walletSlice";

import { WalletContext } from "./WalletContext";

import TransactionFailureModal from "../NewTransactionPage/TransactionFailureModal";
import TransactionSuccessModal from "../NewTransactionPage/TransactionSuccessModal";
import axios from "axios";

const SendTab = () => {
	const dispatch = useDispatch();
	const api = useSelector(state => state.network.api);
	const { walletInfo, params, externalKeys, internalKeys, xprv } = useContext(WalletContext);
	const [recipientAddr, setRecipientAddr] = useState("");
	const [amount, setAmount] = useState("");
	const [fee, setFee] = useState("");

	const [confirmModal, setConfirmModal] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [error, setError] = useState({});

	const resetFields = () => {
		setRecipientAddr("");
		setAmount("");
		setFee("");
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

	const signAndSendTransaction = async () => {
		const _amount = Math.trunc(amount * params.coin);
		const _fee = Math.trunc(fee * params.coin);

		const utxos = walletInfo.utxos;

		// pick utxos from front to back.
		let inputAmount = 0;
		const inputs = [];
		for (const utxo of utxos) {
			if (inputAmount >= _amount) break;
			inputAmount += utxo.amount;

			console.log(utxo);
			const { pk } = [...externalKeys, ...internalKeys].find(keys => keys.addr === utxo.address);
			const input = createInput(utxo.txHash, utxo.outIndex, pk);
			inputs.push(input);
		}

		const outputs = [];
		const payment = createOutput(recipientAddr, _amount);
		outputs.push(payment);

		const changeAmount = inputAmount - _amount - _fee;
		let changeKeys = null;
		if (changeAmount > 0) {
			changeKeys = deriveKeys(params, xprv, 0, 1, internalKeys.length);
			const change = createOutput(changeKeys.addr, changeAmount);
			outputs.push(change);
		}

		const transaction = createTransaction(params, inputs, outputs);

		for (const input of transaction.inputs) {
			const { sk } = [...externalKeys, ...internalKeys].find(({ pk }) => pk === input.publicKey);
			const signature = signTransactionHex(transaction, sk);
			input.signature = signature;
		}

		transaction.hash = calculateTransactionHash(transaction);

		const validation = (await axios.post(`${api}/transaction`, { transaction })).data;

		if (validation.code !== RESULT.VALID) {
			console.error("tx invalid: ", transaction);
			setError(validation);
			setErrorModal(true);
			return;
		}

		if (changeAmount > 0) {
			const { sk, pk, addr } = changeKeys;
			dispatch(addInternalKeys({ sk, pk, addr, index: internalKeys.length }));
		}

		resetFields();
		setConfirmModal(true);
	};

	const { utxos, transactionsInfo } = walletInfo;
	const balance = utxos.reduce((total, utxo) => total + utxo.amount, 0);

	return (
		<main>
			<div className="field mb-5">
				<label className="label">Recipient's Address</label>
				<div className="field has-addons mb-0">
					<div className="control is-expanded">
						<input
							className="input"
							type="text"
							placeholder="Enter Address"
							value={recipientAddr}
							onChange={({ target: { value } }) => setRecipientAddr(value)}
						></input>
					</div>
					<p className="control">
						<button
							onClick={async () => setRecipientAddr(await navigator.clipboard.readText())}
							className="button"
						>
							<i className="material-icons md-18">content_paste</i>
						</button>
					</p>
				</div>
			</div>

			<div className="is-flex-tablet mb-5" style={{ gap: "2em" }}>
				<div className="field" style={{ flexGrow: 1 }}>
					<label className="label">Amount ({params.symbol})</label>
					<div className="field has-addons mb-0">
						<div className="control is-expanded">
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

						<p className="control">
							<button
								onClick={() => handleAmountChange((balance / params.coin).toFixed(8))}
								className="button"
							>
								Max
							</button>
						</p>
					</div>
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
					<p className="help">Network fees sent to the miner.</p>
				</div>
			</div>

			<div className="mb-2">
				<span className="title is-6">Current balance:</span>
				<span className="ml-3">
					{(balance / params.coin).toFixed(8)} {params.symbol}
				</span>
			</div>
			<div className="mb-6">
				<span className="title is-6">Balance after:</span>
				<span className="ml-3">
					{(balance / params.coin - amount - fee).toFixed(8)} {params.symbol}
				</span>
			</div>

			<button onClick={signAndSendTransaction} className="button is-dark is-block ml-auto">
				Sign & Send
			</button>

			<TransactionSuccessModal isOpen={confirmModal} close={() => setConfirmModal(false)} />
			<TransactionFailureModal
				isOpen={errorModal}
				close={() => setErrorModal(false)}
				error={error}
			/>
		</main>
	);
};

export default SendTab;
