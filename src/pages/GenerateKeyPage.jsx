import React, { useState } from "react";
import { generateKeyPair, getKeyPair } from "blockchain-crypto";

const GenerateKeyPage = () => {
	const [secretKey, setSecretKey] = useState("");
	const [publicKey, setPublicKey] = useState("");

	const generate = () => {
		const { sk, pk } = generateKeyPair();
		setSecretKey(sk);
		setPublicKey(pk);
	};

	const handleChangePrivateKey = privateKey => {
		try {
			const { sk, pk } = getKeyPair(privateKey);
			setSecretKey(sk);
			setPublicKey(pk);
		} catch {
			setSecretKey("");
			setPublicKey("");
		}
	};

	return (
		<section className="section">
			<h1 className="title is-2">Generate Key</h1>
			<div className="field">
				<label className="label">Private / Secret key</label>
				<div className="field has-addons mb-0">
					<div className="control is-expanded">
						<input
							className="input"
							type="text"
							placeholder="Enter or auto-generate private key"
							value={secretKey}
							onChange={({ target }) => handleChangePrivateKey(target.value)}
						></input>
					</div>
					<p className="control">
						<a className="button is-light">
							<i className="material-icons md-18">content_copy</i>
						</a>
					</p>
				</div>
				<p className="help is-danger">
					As the name suggest, this key should be kept private and stored in a safe place.
				</p>
			</div>

			<div className="field">
				<label className="label">Public key / Address</label>
				<div className="field has-addons mb-0">
					<div className="control is-expanded">
						<input className="input" type="text" value={publicKey} readOnly />
					</div>
					<p className="control">
						<a className="button is-light">
							<i className="material-icons md-18">content_copy</i>
						</a>
					</p>
				</div>
				<p className="help is-primary">This is used as an address to send and receive BBC.</p>
			</div>

			<div className="buttons is-pulled-right">
				<button onClick={generate} className="button is-warning">
					Generate random key
				</button>
				<button className="button is-info">Save & Use key</button>
			</div>
			<div className="is-clearfix"></div>
		</section>
	);
};

export default GenerateKeyPage;
