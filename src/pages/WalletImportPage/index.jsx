import React from "react";
import { useHistory } from "react-router";

import { useParams } from "../../hooks/useParams";

import Loading from "../../components/Loading";

const WalletImportPage = () => {
	const history = useHistory();
	const [loading, params] = useParams();

	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	return (
		<main className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Import Wallet</h1>
			<p className="subtitle is-size-6 is-size-5-tablet mb-4">
				Import an existing wallet from your seed phrase.
			</p>
			<hr className="-has-background-grey mt-0 mb-6" />
			<section className="-is-flex" style={{ gap: "2em" }}>
				<div className="field mb-5">
					<label className="label">Word List</label>
					<div className="control">
						<div className="select">
							<select required>
								<option hidden disabled selected value>
									-- select a language --
								</option>
								<option>English</option>
								<option>Spanish</option>
								<option>French</option>
								<option>Chinese Simplified</option>
							</select>
						</div>
					</div>
					<p className="help">This is necessary to properly import your wallet.</p>
				</div>
				<div className="field mb-5">
					<label className="label">Secret backup phrase</label>
					<div className="control">
						<textarea
							className="textarea is-info has-fixed-size"
							placeholder="Please enter your 12 word mnemonic phrase seperated by spaces"
						></textarea>
					</div>
					<p className="help">Make sure you are not being watched! Unless you trust the person.</p>
				</div>

				<div className="field is-grouped">
					<div onClick={() => history.goBack()} className="control ml-auto">
						<button className="button">Cancel</button>
					</div>
					<div className="control">
						<button className="button is-primary">Import</button>
					</div>
				</div>
			</section>
		</main>
	);
};

export default WalletImportPage;
