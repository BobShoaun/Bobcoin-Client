import React from "react";

const MineSuccessModal = ({ isOpen, close, params, blockReward }) => {
	return (
		<div className={`modal ${isOpen ? "is-active" : ""}`}>
			<div className="modal-background"></div>
			<div className="modal-card">
				<section className="modal-card-body p-6" style={{ borderRadius: "1em" }}>
					<div className="mb-5 is-flex is-align-items-center is-justify-content-center">
						<i className="material-icons-outlined md-36 mr-3 has-text-black">view_in_ar</i>
						<h3 className="title is-3">You have mined a Block!</h3>
					</div>
					<img
						style={{ width: "80%", display: "block" }}
						className="mx-auto mb-5"
						src="images/block.jpg"
						alt="transaction"
					/>

					<p className="subtitle is-5 has-text-centered">
						You have found a hash that fits the network difficulty and have been rewarded{" "}
						{blockReward} {params.symbol}. Your block has been broadcasted to the network.
					</p>
					<p className="help has-text-centered mb-4">
						*The block is not mature until after at least {params.blkMaturity} confirmations.
					</p>
					<div className="has-text-centered">
						<button onClick={close} className="button is-dark has-text-weight-semibold">
							Cool
						</button>
					</div>
				</section>
			</div>
			<button onClick={close} className="modal-close is-large" aria-label="close"></button>
		</div>
	);
};

export default MineSuccessModal;
