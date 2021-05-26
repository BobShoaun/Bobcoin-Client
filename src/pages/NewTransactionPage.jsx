import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { newTransaction } from "../store/transactionsSlice";
import { getKeys, createAndSignTransaction, getHighestValidBlock, findUTXOs } from "blockcrypto";

import CurrencyInput from "../components/CurrencyInput";

const NewTransactionPage = () => {
	const dispatch = useDispatch();
	const blockchain = useSelector(state => state.blockchain.chain);
	const transactions = useSelector(state => state.transactions);
	const params = useSelector(state => state.blockchain.params);

	const [showSK, setShowSK] = useState(false);
	const [amount, setAmount] = useState("");
	const [fee, setFee] = useState("");
	const [senderSK, setSenderSK] = useState(localStorage.getItem("sk"));
	const [senderPK, setSenderPK] = useState("");
	const [senderAdd, setSenderAdd] = useState("");
	const [recipientAdd, setRecipientAdd] = useState("");

	useEffect(() => {
		try {
			const { _, pk, address } = getKeys(params, senderSK);
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

	const createTransaction = () => {
		const headBlock = getHighestValidBlock(blockchain);
		const utxos = findUTXOs(blockchain, headBlock, transactions, senderAdd, amount + fee);
		const tx = createAndSignTransaction(
			params,
			utxos,
			senderSK,
			senderPK,
			senderAdd,
			recipientAdd,
			amount,
			fee
		);
		dispatch(newTransaction(tx));
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
					<CurrencyInput onChange={setAmount} />
				</div>

				<div className="field" style={{ flexGrow: 1 }}>
					<label className="label">Fee ({params.symbol})</label>
					<CurrencyInput onChange={setFee} />
				</div>
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
