import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { generateKeys, getKeys } from "blockcrypto";
import QRCode from "qrcode";

const GenerateKeyPage = () => {
	const params = useSelector(state => state.consensus.params);
	const [secretKey, setSecretKey] = useState("");
	const [address, setAddress] = useState("");
	const [skQR, setSKQR] = useState("");
	const [addQR, setAddQR] = useState("");

	const [modalOpen, setModalOpen] = useState(false);

	const generateRandom = () => {
		const { sk, _, address } = generateKeys(params);
		setSecretKey(sk);
		setAddress(address);
		generateQRCode(sk, address);
	};

	const handleChangePrivateKey = privateKey => {
		try {
			const { sk, _, address } = getKeys(params, privateKey);
			setSecretKey(sk);
			setAddress(address);
			generateQRCode(sk, address);
		} catch {
			setSecretKey("");
			setAddress("");
		}
	};

	const saveKeys = () => {
		localStorage.setItem("sk", secretKey);
		localStorage.setItem("add", address);
		setModalOpen(true);
	};

	const generateQRCode = async (sk, add) => {
		try {
			setSKQR(await QRCode.toString(sk));
			setAddQR(await QRCode.toString(add));
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<section className="section">
			<h1 className="title is-2">Generate Key</h1>
			<p className="subtitle is-4" style={{ marginBottom: "3em" }}>
				A private key and address pair for you to store, send and receive {params.name}.
			</p>

			<div className="is-flex" style={{ marginBottom: "6em" }}>
				<section className=" mr-6" style={{ width: "50%" }}>
					<div className="box mx-auto mb-6" style={{ width: "300px", height: "300px" }}>
						<div
							dangerouslySetInnerHTML={{ __html: skQR }}
							style={{ width: "100%", height: "100%", background: "lightgray" }}
						></div>
					</div>

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
								<Link className="button is-light">
									<i className="material-icons md-18">content_copy</i>
								</Link>
							</p>
						</div>
						<p className="help is-danger">
							As the name suggest, this key should be kept private and stored in a safe place.
						</p>
					</div>
				</section>

				<section className="" style={{ width: "50%" }}>
					<div className="box mx-auto mb-6" style={{ width: "300px", height: "300px" }}>
						<div
							dangerouslySetInnerHTML={{ __html: addQR }}
							style={{ width: "100%", height: "100%", background: "lightgray" }}
						></div>
					</div>
					<div className="field">
						<label className="label">{params.name} Address</label>
						<div className="field has-addons mb-0">
							<div className="control is-expanded">
								<input className="input" type="text" value={address} readOnly />
							</div>
							<p className="control">
								<Link className="button is-light">
									<i className="material-icons md-18">content_copy</i>
								</Link>
							</p>
						</div>
						<p className="help">This is used as an address to send and receive {params.symbol}.</p>
					</div>
				</section>
			</div>

			<div className="buttons is-pulled-right">
				<button onClick={generateRandom} className="button is-dark has-text-weight-medium">
					<span className="material-icons-outlined mr-2">casino</span>
					Generate random key
				</button>
				<button onClick={saveKeys} className="button is-info has-text-weight-medium">
					<span className="material-icons-outlined mr-2">save</span>
					Save & Use key
				</button>
			</div>
			<div className="is-clearfix"></div>

			<div className={`modal ${modalOpen && "is-active"}`}>
				<div className="modal-background"></div>
				<div className="modal-card">
					<section className="modal-card-body p-6" style={{ borderRadius: "1em" }}>
						<div className="mb-5 is-flex is-align-items-center is-justify-content-center">
							<i className="material-icons-outlined md-36 mr-3 has-text-black">vpn_key</i>
							<h3 className="title is-3">Your keys are saved!</h3>
						</div>
						<div className="is-flex is-justify-items-center mb-0">
							<div className="has-text-right mr-3">
								<p className="subtitle is-6 mb-3">Private key:</p>
								<p className="subtitle is-6">Address:</p>
							</div>
							<div className="has-text-weight-semibold">
								<p className="-subtitle is-6 mb-2">{secretKey}</p>
								<p className="-subtitle is-6">{address}</p>
							</div>
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
