import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { generateKeys, getKeys } from "blockcrypto";
import QRCode from "qrcode";
import { copyToClipboard } from "../helpers";

import { setKeys as setWalletKeys } from "../store/walletSlice";

const GenerateKeyPage = () => {
	const dispatch = useDispatch();
	const params = useSelector(state => state.consensus.params);

	const [keys, setKeys] = useState({ sk: "", address: "" });
	const [skQR, setSKQR] = useState("");
	const [addQR, setAddQR] = useState("");

	const [modalOpen, setModalOpen] = useState(false);

	const generateRandom = () => {
		const keys = generateKeys(params);
		setKeys(keys);
		generateQRCode(keys);
	};

	const handleChangePrivateKey = privateKey => {
		if (privateKey === "") {
			setKeys({ sk: "", address: "" });
			setSKQR(null);
			setAddQR(null);
			return;
		}
		try {
			const keys = getKeys(params, privateKey);
			setKeys(keys);
			generateQRCode(keys);
		} catch {
			console.log("possibly invalid base58 character");
		}
	};

	const saveKeys = () => {
		dispatch(setWalletKeys(keys));
		setModalOpen(true);
	};

	const generateQRCode = async keys => {
		try {
			setSKQR(await QRCode.toString(keys.sk));
			setAddQR(await QRCode.toString(keys.address));
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<section className="section">
			<h1 className="title is-2">Generate Key</h1>
			<p className="subtitle is-4 mb-6">
				A private key and address pair for you to store, send and receive {params.name}.
			</p>

			<div className="is-flex-tablet mb-6">
				<section className="p-6" style={{ flexBasis: "50%" }}>
					<div className="box mx-auto mb-6" style={{ width: "250px", height: "250px" }}>
						{skQR ? (
							<div dangerouslySetInnerHTML={{ __html: skQR }}></div>
						) : (
							<div
								className="is-flex has-text-centered"
								style={{ width: "100%", height: "100%", background: "lightgray" }}
							>
								<p className="m-auto px-4">Click on "Generate Random Key" below</p>
							</div>
						)}
					</div>

					<div className="field">
						<label className="label">Private / Secret key</label>
						<div className="field has-addons mb-0">
							<div className="control is-expanded">
								<input
									className="input"
									type="text"
									placeholder="Enter or auto-generate private key"
									value={keys.sk}
									onChange={({ target }) => handleChangePrivateKey(target.value)}
								></input>
							</div>
							<p className="control">
								<button className="button" onClick={() => copyToClipboard(keys.sk)}>
									<i className="material-icons md-18">content_copy</i>
								</button>
							</p>
						</div>
						<p className="help is-danger">
							As the name suggest, this key should be kept private and stored in a safe place.
						</p>
					</div>
				</section>

				<section className="p-6" style={{ flexBasis: "50%" }}>
					<div className="box mx-auto mb-6" style={{ width: "250px", height: "250px" }}>
						{addQR ? (
							<div dangerouslySetInnerHTML={{ __html: addQR }}></div>
						) : (
							<div
								className="is-flex has-text-centered"
								style={{ width: "100%", height: "100%", background: "lightgray" }}
							>
								<p className="m-auto px-4">Click on "Generate Random Key" below</p>
							</div>
						)}
					</div>
					<div className="field">
						<label className="label">{params.name} Address</label>
						<div className="field has-addons mb-0">
							<div className="control is-expanded">
								<input className="input" type="text" value={keys.address} readOnly />
							</div>
							<p className="control">
								<button className="button" onClick={() => copyToClipboard(keys.address)}>
									<i className="material-icons md-18">content_copy</i>
								</button>
							</p>
						</div>
						<p className="help">This is used as an address to send and receive {params.symbol}.</p>
					</div>
				</section>
			</div>

			<div className="has-text-right">
				<button onClick={generateRandom} className="button is-dark has-text-weight-medium mb-3">
					<span className="material-icons-outlined mr-2">casino</span>
					Generate random key
				</button>
				<button onClick={saveKeys} className="button is-info has-text-weight-medium ml-3 mb-3">
					<span className="material-icons-outlined mr-2">save</span>
					Save & Use key
				</button>
			</div>

			<div className={`modal ${modalOpen && "is-active"}`}>
				<div className="modal-background"></div>
				<div className="modal-card">
					<section className="modal-card-body p-6" style={{ borderRadius: "1em" }}>
						<div className="mb-5 is-flex is-align-items-center is-justify-content-center">
							<i className="material-icons-outlined md-36 mr-3 has-text-black">vpn_key</i>
							<h3 className="title is-3">Your keys are saved!</h3>
						</div>
						<div
							className="mx-5"
							style={{
								display: "grid",
								gridTemplateColumns: "1fr auto",
								columnGap: "1em",
								rowGap: ".5em",
							}}
						>
							<p className="subtitle is-6 mb-0 has-text-right" style={{ whiteSpace: "nowrap" }}>
								Private key:
							</p>
							<p className="has-text-weight-semibold is-6 mb-0" style={{ wordBreak: "break-all" }}>
								{keys.sk}
							</p>
							<p className="subtitle is-6 has-text-right mb-0">Address:</p>
							<p className="has-text-weight-semibold is-6 mb-0">{keys.address}</p>
						</div>
						<img
							style={{ width: "80%", display: "block" }}
							className="mx-auto"
							src="images/key.jpg"
							alt="transaction"
						/>

						<p className="subtitle is-5 has-text-centered">
							Your private key and address has now been stored locally for your convenience. Now you
							can start sending and receiving {params.name}s!
						</p>
						<p className="help has-text-centered mb-4">
							*It is your responsiblity to keep your private keys safe, clear your browser's local
							storage and use a cold storage for maximum security.
						</p>
						<div className="has-text-centered">
							<button
								onClick={() => setModalOpen(false)}
								className="button is-dark has-text-weight-semibold"
							>
								Alright
							</button>
						</div>
					</section>
				</div>
				<button
					onClick={() => setModalOpen(false)}
					className="modal-close is-large"
					aria-label="close"
				></button>
			</div>
		</section>
	);
};

export default GenerateKeyPage;
