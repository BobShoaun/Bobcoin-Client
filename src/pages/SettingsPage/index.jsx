import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setNetwork as setNet } from "../../store/blockchainSlice";

const SettingsPage = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const net = useSelector(state => state.blockchain.network);

	const [network, setNetwork] = useState(net);
	const [miningPopup, setMiningPopup] = useState(true);

	useEffect(() => {
		const flagls = localStorage.getItem("mining-popup");
		const show = flagls ? flagls === "true" : true;
		setMiningPopup(show);
	}, []);

	const confirmSettings = () => {
		localStorage.setItem("mining-popup", miningPopup);
		dispatch(setNet(network));
		history.goBack();
	};

	return (
		<section className="section">
			<h1 className="title is-2">Settings</h1>
			<p className="subtitle is-5">Change your network and client settings.</p>
			<hr />
			<h2 className="title is-5 is-spaced mb-2">Network</h2>
			<div className="control has-icons-left mb-5">
				<div className="select fis-medium">
					<select value={network} onChange={({ target }) => setNetwork(target.value)}>
						<option value="mainnet">Mainnet</option>
						<option value="testnet">Testnet</option>
					</select>
				</div>
				<div className="icon is-left ">
					<span className="material-icons-two-tone has-text-dark fmd-28">
						{network === "mainnet" ? "language" : "bug_report"}
					</span>
				</div>
			</div>

			<h2 className="title is-5 is-spaced mb-2">Mining</h2>
			<label className="checkbox is-flex is-align-items-center mb-6">
				<input
					type="checkbox"
					checked={miningPopup}
					onChange={({ target }) => setMiningPopup(target.checked)}
				/>
				<p className="ml-2">Show mining success pop up</p>
			</label>

			<button onClick={confirmSettings} className="button is-info">
				Confirm
			</button>
		</section>
	);
};

export default SettingsPage;
