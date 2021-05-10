import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { newTransaction } from "../store/transactionsSlice";
import { getKeyPair, createAndSignTransaction, getHighestValidBlock } from "blockchain-crypto";

const NewTransactionPage = () => {
	const dispatch = useDispatch();
	const blockchain = useSelector(state => state.blockchain);

	const [showSK, setShowSK] = useState(false);
	const [amount, setAmount] = useState("");
	const [senderSK, setSenderSK] = useState("");
	const [senderPK, setSenderPK] = useState("");
	const [recipientPK, setRecipientPK] = useState("");

	const handleAmountChange = amount => {
		setAmount(amount);
	};

	const handleSenderKeyChange = senderSK => {
		try {
			const { sk, pk } = getKeyPair(senderSK);
			setSenderSK(sk);
			setSenderPK(pk);
		} catch {
			setSenderSK("");
			setSenderPK("");
		}
	};

	const createTransaction = () => {
		const tx = createAndSignTransaction(
			blockchain,
			getHighestValidBlock(blockchain),
			senderSK,
			senderPK,
			recipientPK,
			amount,
			0
		);
		dispatch(newTransaction(tx));
	};

	return (
		<section className="section">
			<h1 className="title is-2">New Transaction</h1>
			<p className="subtitle is-4">Create and sign a new transaction.</p>

			<div className="field">
				<label className="label">Sender's Private key</label>
				<div className="field has-addons mb-0">
					<div className="control is-expanded">
						<input
							className="input"
							type={showSK ? "text" : "password"}
							placeholder="Enter private key"
							onChange={({ target: { value } }) => handleSenderKeyChange(value)}
						></input>
					</div>
					<p className="control">
						<button onClick={() => setShowSK(showSK => !showSK)} className="button is-light">
							<i className="material-icons md-18">{showSK ? "visibility_off" : "visibility"}</i>
						</button>
					</p>
				</div>
				<p className="help">You can only spend from wallets which you have the private key.</p>
			</div>

			<div className="field">
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

			<div className="field">
				<label className="label">Recipient's Public key</label>
				<input
					className="input"
					type="text"
					placeholder="Enter public key"
					onChange={({ target: { value } }) => setRecipientPK(value)}
				></input>
				{/* <p className="help">The public key of the recipient of this transaction.</p> */}
			</div>

			<div className="field mb-6">
				<label className="label">Amount (BBC)</label>
				<input
					value={amount}
					onChange={({ target }) => handleAmountChange(target.value)}
					onBlur={({ target }) => handleAmountChange(Number(target.value).toFixed(6))}
					step="0.01"
					className="input"
					type="number"
					placeholder="Enter amount in BBC"
				></input>
				{/* <p className="help">The public key of the recipient of this transaction.</p> */}
			</div>

			<div className="buttons is-pulled-right">
				<button className="button">Cancel</button>
				<button className="button is-info" onClick={createTransaction}>
					Create & Sign
				</button>
			</div>
			<div className="is-clearfix"></div>
		</section>
	);
};

export default NewTransactionPage;
