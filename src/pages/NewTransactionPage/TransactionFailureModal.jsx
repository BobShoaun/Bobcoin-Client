import React from "react";

import { RESULT } from "blockcrypto";

const TransactionFailureModal = ({ isOpen, close, error }) => {
	return (
		<div className={`modal ${isOpen && "is-active"}`}>
			<div className="modal-background"></div>
			<div className="modal-card">
				<section className="modal-card-body p-6-tablet" style={{ borderRadius: "1em" }}>
					<div className="mb-5 is-flex is-align-items-center is-justify-content-center">
						<i className="material-icons-outlined md-36 mr-3 has-text-danger">dangerous</i>
						<h3 className="title is-3">Invalid Transaction!</h3>
					</div>
					<img
						style={{ width: "80%", display: "block" }}
						className="mx-auto mb-5"
						src="images/poor.jpg"
						alt="transaction"
					/>
					<h2 className="title is-5 has-text-centered is-spaced mb-4">
						Here are some possible reasons:
					</h2>

					<ol className="subtitle is-6 mb-6 mx-5">
						<li className="mb-2">You are attempting to spend coins that do not exist.</li>
						<li className="mb-2">Your transaction is malformed. (missing data)</li>
						<li className="mb-2">You transaction attempts to double spend.</li>
						<li className="mb-2">You have typed an invalid address.</li>
					</ol>

					<h2 className="title is-6 is-spaced mb-3">Error message:</h2>
					<pre className="subtitle is-6">
						{Object.keys(RESULT).find(code => RESULT[code] === error.code)}: {error.msg}
					</pre>

					<p className="help has-text-centered mb-5">
						*Your transaction was rejected by the network.
					</p>

					<div className="has-text-centered">
						<button onClick={close} className="button is-dark has-text-weight-semibold">
							Okay
						</button>
					</div>
				</section>
			</div>
			<button onClick={close} className="modal-close is-large" aria-label="close"></button>
		</div>
	);
};

export default TransactionFailureModal;
