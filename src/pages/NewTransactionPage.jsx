import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { newTransaction } from "../store/transactionsSlice";
import { getKeys, createAndSignTransaction, getHighestValidBlock, findUTXOs } from "blockcrypto";

const NewTransactionPage = () => {
	const dispatch = useDispatch();
	const blockchain = useSelector(state => state.blockchain.chain);
	const transactions = useSelector(state => state.transactions.txs);
	const params = useSelector(state => state.consensus.params);

	const [showSK, setShowSK] = useState(false);
	const [amount, setAmount] = useState("");
	const [fee, setFee] = useState("");
	const [senderSK, setSenderSK] = useState(localStorage.getItem("sk"));
	const [senderPK, setSenderPK] = useState("");
	const [senderAdd, setSenderAdd] = useState("");
	const [recipientAdd, setRecipientAdd] = useState("");

	const [confirmModal, setConfirmModal] = useState(false);
	const [errorModal, setErrorModal] = useState(false);

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

	const createTransaction = () => {
		const _amount = Math.trunc(amount * params.coin);
		const _fee = Math.trunc(fee * params.coin);

		const headBlock = getHighestValidBlock(blockchain);
		const utxos = findUTXOs(blockchain, headBlock, transactions, senderAdd, _amount + _fee);
		if (!utxos.length) {
			setErrorModal(true);
			return;
		}
		const tx = createAndSignTransaction(
			params,
			utxos,
			senderSK,
			senderPK,
			senderAdd,
			recipientAdd,
			_amount,
			_fee
		);
		dispatch(newTransaction(tx));
		setConfirmModal(true);
	};

	return (
		<section className="section">
			<h1 className="title is-2">New Transaction</h1>
			<p className="subtitle is-4">Create and sign a new transaction.</p>

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
						<button onClick={() => setShowSK(showSK => !showSK)} className="button is-light">
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
				<p className="help">The public key of the sender generated from the private key above.</p>
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
				<p className="help">The address of the sender generated from the public key above.</p>
			</div>

			<div className="field mb-4">
				<label className="label">Recipient's Address</label>
				<input
					className="input"
					type="text"
					placeholder="Enter Address"
					onChange={({ target: { value } }) => setRecipientAdd(value)}
				></input>
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
				<button className="button">Cancel</button>
				<button className="button is-info has-text-weight-semibold" onClick={createTransaction}>
					<span className="material-icons-outlined mr-2">payments</span>
					Create & Sign
				</button>
			</div>
			<div className="is-clearfix"></div>

			<div className={`modal ${confirmModal && "is-active"}`}>
				<div className="modal-background"></div>
				<div className="modal-card">
					<section className="modal-card-body p-6" style={{ borderRadius: "1em" }}>
						<div className="mb-3 is-flex is-align-items-center is-justify-content-center">
							<i className="material-icons-outlined md-36 mr-3 has-text-success">
								check_circle_outline
							</i>
							<h3 className="title is-3">Transaction Complete!</h3>
						</div>
						<img
							style={{ width: "80%", display: "block" }}
							className="mx-auto"
							src="images/transaction.jpg"
							alt="transaction"
						/>
						<p className="subtitle is-5 has-text-centered">
							Your transaction has been signed and broadcasted to the network. Theres no turning
							back!
						</p>
						<div className="has-text-centered">
							<button
								onClick={() => setConfirmModal(false)}
								className="button is-primary has-text-weight-semibold"
							>
								Okay
							</button>
						</div>
					</section>
				</div>
				<button
					onClick={() => setConfirmModal(false)}
					className="modal-close is-large"
					aria-label="close"
				></button>
			</div>

			<div className={`modal ${errorModal && "is-active"}`}>
				<div className="modal-background"></div>
				<div className="modal-card">
					<section className="modal-card-body p-6" style={{ borderRadius: "1em" }}>
						<div className="mb-5 is-flex is-align-items-center is-justify-content-center">
							<i className="material-icons-outlined md-36 mr-3 has-text-danger">dangerous</i>
							<h3 className="title is-3">Invalid Transaction!</h3>
						</div>
						{/* <img
							style={{ width: "80%", display: "block" }}
							className="mx-auto"
							src="images/transaction.jpg"
							alt="transaction"
						/> */}
						<p className="subtitle is-5 has-text-centered mb-6">
							You are attempting to spend coins that do not exist for this address. Your transaction
							will be rejected by the network.
						</p>
						<div className="has-text-centered">
							<button
								onClick={() => setErrorModal(false)}
								className="button is-primary has-text-weight-semibold"
							>
								Okay
							</button>
						</div>
					</section>
				</div>
				<button
					onClick={() => setErrorModal(false)}
					className="modal-close is-large"
					aria-label="close"
				></button>
			</div>
		</section>
	);
};

export default NewTransactionPage;
