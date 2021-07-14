import React, { useState } from "react";
import { useHistory } from "react-router";
import { useParams } from "../../hooks/useParams";

import Loading from "../../components/Loading";
import "./index.css";

const WalletCreatePage = () => {
	const history = useHistory();
	const [loading, params] = useParams();

	const [showBackup, setShowBackup] = useState(false);

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
								<select required>
									<option>English</option>
									<option>Spanish</option>
									<option>French</option>
									<option>Chinese Simplified</option>
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
							<button onClick={() => setShowBackup(true)} className="button is-primary">
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
							<div className="card mnemonic-card mb-6 is-clickable">
								<div className="card-content px-6 py-5">
									<p className=" has-text-centered mt-4" style={{ marginBottom: "2.5em" }}>
										Hover/Tap to reveal
									</p>

									<div className="mnemonic-list mb-5">
										{Array(12)
											.fill("-------- ")
											.map((value, index) => (
												<span
													style={{
														whiteSpace: "nowrap",
													}}
												>
													{index + 1}. {value}
												</span>
											))}
									</div>
									<div className="has-text-right py-3">
										<button className="button is-small">
											<span className="material-icons-outlined md-18 mr-2">content_copy</span>Copy
										</button>
									</div>
								</div>
							</div>

							<div className="field mb-6">
								<div className="control has-text-right">
									<button className="button is-link">Confirm & Save</button>
								</div>
							</div>
						</>
					)}
				</div>
			</section>
		</main>
	);
};

export default WalletCreatePage;
