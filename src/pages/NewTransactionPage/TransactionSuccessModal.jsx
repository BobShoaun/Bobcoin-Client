const TransactionSuccessModal = ({ isOpen, close }) => {
	return (
		<div className={`modal ${isOpen && "is-active"}`}>
			<div className="modal-background"></div>
			<div className="modal-card">
				<section className="modal-card-body p-6" style={{ borderRadius: "1em" }}>
					<div className="mb-3 is-flex is-align-items-center is-justify-content-center">
						<i className="material-icons-outlined md-36 mr-3 has-text-success">
							check_circle_outline
						</i>
						<h3 className="title is-3">Transaction Complete!</h3>
					</div>
					<img
						style={{ width: "80%", display: "block" }}
						className="mx-auto"
						src="images/transaction.jpg"
						alt="transaction"
					/>
					<p className="subtitle is-5 has-text-centered">
						Your transaction has been signed and broadcasted to the network. Theres no turning back!
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

export default TransactionSuccessModal;
