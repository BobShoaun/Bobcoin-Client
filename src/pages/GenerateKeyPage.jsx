import React, { useState } from "react";
import { Link } from "react-router-dom";
import { generateKeyPair, getKeyPair } from "blockchain-crypto";
import QRCode from "qrcode";

const GenerateKeyPage = () => {
	const [secretKey, setSecretKey] = useState("");
	const [publicKey, setPublicKey] = useState("");
	const [skQR, setSKQR] = useState("");
	const [pkQR, setPKQR] = useState("");

	const generate = () => {
		const { sk, pk } = generateKeyPair();
		setSecretKey(sk);
		setPublicKey(pk);
		generateQRCode(sk, pk);
	};

	const handleChangePrivateKey = privateKey => {
		try {
			const { sk, pk } = getKeyPair(privateKey);
			setSecretKey(sk);
			setPublicKey(pk);
			generateQRCode(sk, pk);
		} catch {
			setSecretKey("");
			setPublicKey("");
		}
	};

	const saveKey = () => {
		localStorage.setItem("sk", secretKey);
		localStorage.setItem("pk", publicKey);
	};

	const generateQRCode = async (sk, pk) => {
		try {
			setSKQR(await QRCode.toString(sk));
			setPKQR(await QRCode.toString(pk));
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<section className="section">
			<h1 className="title is-2">Generate Key</h1>

			<div className="is-flex mb-5">
				<section className=" mr-6" style={{ width: "50%" }}>
					<p
						dangerouslySetInnerHTML={{ __html: skQR }}
						className="ml-auto mx-auto"
						style={{ width: "300px", height: "300px" }}
					></p>
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
					<p
						dangerouslySetInnerHTML={{ __html: pkQR }}
						className="ml-auto mx-auto"
						style={{ width: "300px", height: "300px" }}
					></p>
					<div className="field">
						<label className="label">Public key / Address</label>
						<div className="field has-addons mb-0">
							<div className="control is-expanded">
								<input className="input" type="text" value={publicKey} readOnly />
							</div>
							<p className="control">
								<Link className="button is-light">
									<i className="material-icons md-18">content_copy</i>
								</Link>
							</p>
						</div>
						<p className="help">This is used as an address to send and receive BBC.</p>
					</div>
				</section>
			</div>

			<div className="buttons is-pulled-right">
				<button onClick={generate} className="button is-warning">
					Generate random key
				</button>
				<button onClick={saveKey} className="button is-info">
					Save & Use key
				</button>
			</div>
			<div className="is-clearfix"></div>
		</section>
	);
};

export default GenerateKeyPage;
