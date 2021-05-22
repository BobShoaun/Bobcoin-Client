import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { generateKeys, getKeys } from "blockchain-crypto";
import QRCode from "qrcode";

const GenerateKeyPage = () => {
	const params = useSelector(state => state.blockchain.params);
	const [secretKey, setSecretKey] = useState("");
	const [address, setAddress] = useState("");
	const [skQR, setSKQR] = useState("");
	const [addQR, setAddQR] = useState("");

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

			<div className="is-flex mb-5">
				<section className=" mr-6" style={{ width: "50%" }}>
					<p
						dangerouslySetInnerHTML={{ __html: skQR }}
						className="ml-auto mx-auto mb-5"
						style={{ width: "300px", height: "300px", background: "lightgray" }}
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
						dangerouslySetInnerHTML={{ __html: addQR }}
						className="ml-auto mx-auto mb-5"
						style={{ width: "300px", height: "300px", background: "lightgray" }}
					></p>
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
				<button onClick={generateRandom} className="button is-warning">
					Generate random key
				</button>
				<button onClick={saveKeys} className="button is-info">
					Save & Use key
				</button>
			</div>
			<div className="is-clearfix"></div>
		</section>
	);
};

export default GenerateKeyPage;
