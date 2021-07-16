import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "../../hooks/useParams";

import Loading from "../../components/Loading";
import "./index.css";

import { generateHdKey, deriveKeys } from "blockcrypto";
import { copyToClipboard } from "../../helpers";
import { setHdKeys as setHdWalletKeys, addExternalKeys } from "../../store/walletSlice";

const WalletCreatePage = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [loading, params] = useParams();

	const [showBackup, setShowBackup] = useState(false);
	const [hdKeys, setHdKeys] = useState({});
	const [hover, setHover] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);

	const wordListSelect = useRef(null);

	const generate = async () => {
		const wordList = wordListSelect.current.value;
		if (!wordList) console.error("wordlist not selected!");
		const hdKeys = await generateHdKey("", wordList);
		setHdKeys(hdKeys);
		setShowBackup(true);
	};

	const saveKeys = () => {
		const childKeys = deriveKeys(params, hdKeys.xprv, 0, 0, 0);
		dispatch(setHdWalletKeys(hdKeys));
		dispatch(
			addExternalKeys({ sk: childKeys.sk, pk: childKeys.pk, addr: childKeys.addr, index: 0 })
		);
		setModalOpen(true);
	};

	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	return (
		<main className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Create a new Wallet</h1>
			<p className="subtitle is-size-6 is-size-5-tablet mb-4">
				A wallet lets you properly store, send and receive {params.symbol}.
			</p>
			<hr className="mt-0 mb-6" />

			<section className="is-flex-tablet" style={{ gap: "3em" }}>
				<div style={{ flexBasis: "50%" }}>
					<div className="field mb-5">
						<label className="label">Word List</label>
						<div className="control">
							<div className="select">
								<select ref={wordListSelect} required onChange={() => setShowBackup(false)}>
									<option value="english">English</option>
									<option value="spanish">Spanish</option>
									<option value="french">French</option>
									<option value="chinese_simplified">Chinese (Simplified)</option>
									<option value="chinese_traditional">Chinese (Traditional)</option>
									<option value="italian">Italian</option>
									<option value="japanese">Japanese</option>
									<option value="korean">Korean</option>
								</select>
							</div>
						</div>
						<p className="help">Choose your preferred language.</p>
					</div>

					<div className="field is-grouped mb-6">
						<div className="control ml-auto">
							<button onClick={() => history.goBack()} className="button">
								Cancel
							</button>
						</div>
						<div className="control">
							<button onClick={generate} className="button is-primary">
								Generate
							</button>
						</div>
					</div>
				</div>
				{/* <hr className="mt-0 mb-6" /> */}
				<div style={{ flexBasis: "50%" }}>
					{showBackup && (
						<>
							<h3 className="title is-5">Secret backup phrase</h3>
							<p className="subtitle is-6">
								Copy or write this down in the same order as it is presented. As the title suggests,
								you should not share this phrase with others.
							</p>
							<div
								onMouseEnter={() => setHover(true)}
								onMouseLeave={() => setHover(false)}
								className="card mnemonic-card mb-6 is-clickable"
							>
								<div className="card-content px-6 py-5">
									<p className=" has-text-centered mt-4" style={{ marginBottom: "2.5em" }}>
										Hover/Tap to reveal
									</p>

									<div className="mnemonic-list mb-5">
										{hdKeys.mnemonic.split(/\s+/).map((value, index) => (
											<div key={index} className="is-flex">
												<p>{index + 1}.</p>
												<p
													className="has-text-centered"
													style={{ flexBasis: "100%", whiteSpace: "nowrap" }}
												>
													{hover ? value : "------"}
												</p>
											</div>
										))}
									</div>

									<div className="has-text-right py-3">
										<button
											onClick={() => copyToClipboard(hdKeys.mnemonic)}
											className="button is-small"
										>
											<span className="material-icons-outlined md-18 mr-2">content_copy</span>Copy
										</button>
									</div>
								</div>
							</div>

							<div className="field mb-6">
								<div className="control has-text-right">
									<button onClick={saveKeys} className="button is-link">
										Confirm & Save
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</section>

			<div className={`modal ${modalOpen && "is-active"}`}>
				<div className="modal-background"></div>
				<div className="modal-card">
					<section className="modal-card-body p-6-tablet" style={{ borderRadius: "1em" }}>
						<div className="mb-5 is-flex is-align-items-center is-justify-content-center">
							<i className="material-icons-outlined md-36 mr-3 has-text-black">
								account_balance_wallet
							</i>
							<h3 className="title is-3">Your wallet is saved</h3>
						</div>

						<p className="subtitle is-5 has-text-centered is-spaced mb-5">
							The keys in your wallet have been stored locally in the browser for your convenience.
						</p>

						<p className="title is-spaced is-6 mb-2">Backup phrase:</p>
						<pre className="subtitle is-spaced is-6 py-2 mb-4">{hdKeys.mnemonic}</pre>

						<p className="title is-spaced is-6 mb-2">Master private key:</p>
						<pre className="subtitle is-spaced is-6 py-2 mb-4">{hdKeys.xprv}</pre>

						<p className="title is-spaced is-6 mb-2">Master public key:</p>
						<pre className="subtitle is-spaced is-6 py-2 mb-6">{hdKeys.xpub}</pre>

						<p className="help has-text-centered mb-4">
							*It is your responsiblity to keep your private key and mnemonic safe, clear your
							browser's local storage and use an offline storage for maximum security.
						</p>

						<div className="has-text-centered">
							<button
								onClick={() => history.push("./")}
								className="button is-dark has-text-weight-semibold"
							>
								Okay
							</button>
						</div>
					</section>
				</div>
				<button
					onClick={() => history.push("./")}
					className="modal-close is-large"
					aria-label="close"
				></button>
			</div>
		</main>
	);
};

export default WalletCreatePage;
