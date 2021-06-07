import React from "react";

const MineFailureModal = ({ isOpen, close, error }) => {
	return (
		<div className={`modal ${isOpen ? "is-active" : ""}`}>
			<div className="modal-background"></div>
			<div className="modal-card">
				<section className="modal-card-body p-6" style={{ borderRadius: "1em" }}>
					<div className="mb-5 is-flex is-align-items-center is-justify-content-center">
						<i className="material-icons-outlined md-36 mr-3 has-text-danger">gpp_maybe</i>
						<h3 className="title is-3">You mined an invalid block!</h3>
					</div>
					{/* <img
						style={{ width: "80%", display: "block" }}
						className="mx-auto mb-5"
						src="images/block.jpg"
						alt="transaction"
					/> */}

					<h2 className="title is-5 has-text-centered is-spaced mb-4">
						Here are some possible reasons:
					</h2>
					<p className="subtitle is-5 has-text-centered mb-6">
						<ol>
							<li>Your block is malformed. (missing data)</li>
							<li>You mined from an invalid branch.</li>
							<li>A transaction you included in the block is invalid.</li>
						</ol>
					</p>

					<h2 className="title is-6 is-spaced mb-3">Error message:</h2>
					<pre className="subtitle is-6">
						Code {error.code}: {error.msg}
					</pre>

					<p className="help has-text-centered mb-4">
						*Your invalid block will be rejected by the network.
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

export default MineFailureModal;
