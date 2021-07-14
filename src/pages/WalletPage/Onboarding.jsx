import React from "react";
import { useHistory } from "react-router";
import "./index.css";

const Onboarding = () => {
	const history = useHistory();

	return (
		<main className="is-flex-tablet" style={{ gap: "2em" }}>
			<div
				onClick={() => history.push("wallet/import")}
				className="wallet-card card is-flex-grow-1 is-clickable"
				style={{ flexBasis: "50%" }}
			>
				<div className="card-content p-6 has-text-centered">
					<div style={{ marginBlock: "8em" }}>
						<span className="material-icons-two-tone is-block mb-4" style={{ fontSize: "5em" }}>
							file_download
						</span>
						<h2 className="title is-4 is-spaced mb-3">Import Wallet</h2>
						<p className="subtitle is-6 mx-6">
							If you already own a wallet and have the secret 12 word mnemonic phrase.
						</p>
					</div>
				</div>
			</div>
			<div
				onClick={() => history.push("wallet/create")}
				className="wallet-card card is-flex-grow-1 is-clickable"
				style={{ flexBasis: "50%" }}
			>
				<div className="card-content p-6 has-text-centered">
					<div style={{ marginBlock: "8em" }}>
						<span className="material-icons-two-tone is-block mb-4" style={{ fontSize: "5em" }}>
							account_balance_wallet
						</span>
						<h2 className="title is-4 is-spaced mb-3">Create a new Wallet</h2>
						<p className="subtitle is-6 mx-6">
							Generate a new mnemonic phrase and seed from random numbers.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Onboarding;
