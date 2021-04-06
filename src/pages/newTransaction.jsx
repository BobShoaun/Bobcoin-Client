import React, { Component } from "react";

class NewTransaction extends Component {
	state = {
		showPrivateKey: false,
		amount: "",
	};
	handleAmountChange = amount => {
		this.setState({ amount });
	};
	render() {
		return (
			<section className="section">
				<h1 className="title is-2">New Transaction</h1>
				<p className="subtitle is-4">Create and sign a new transaction.</p>

				<div className="field">
					<label className="label">Sender's Private key</label>
					<div className="field has-addons mb-0">
						<div className="control is-expanded">
							<input
								className="input"
								type={this.state.showPrivateKey ? "text" : "password"}
								placeholder="Enter private key"
							></input>
						</div>
						<p className="control">
							<button
								onClick={() => this.setState({ showPrivateKey: !this.state.showPrivateKey })}
								className="button is-light"
							>
								<i className="material-icons md-18">
									{this.state.showPrivateKey ? "visibility_off" : "visibility"}
								</i>
							</button>
						</p>
					</div>
					<p className="help">You can only spend from wallets which you have the private key.</p>
				</div>

				<div className="field">
					<label className="label">Sender's Public key</label>
					<input
						value={''}
						className="input"
						type="text"
						placeholder="Input private key above to get public key"
						readOnly
					></input>
					<p className="help">The public key of the sender generated from the private key above.</p>
				</div>

				<div className="field">
					<label className="label">Recipient's Public key</label>
					<input className="input" type="text" placeholder="Enter public key"></input>
					{/* <p className="help">The public key of the recipient of this transaction.</p> */}
				</div>

				<div className="field">
					<label className="label">Amount (BBC)</label>
					<input
						value={this.state.amount}
						onChange={({ target }) => this.handleAmountChange(target.value)}
						onBlur={({ target }) => this.handleAmountChange(Number(target.value).toFixed(6))}
						step="0.01"
						className="input"
						type="number"
						placeholder="Enter amount in BBC"
					></input>
					{/* <p className="help">The public key of the recipient of this transaction.</p> */}
				</div>

				<div className="buttons is-pulled-right">
					<button className="button">Cancel</button>
					<button className="button is-info">Create & Sign</button>
				</div>
				<div className="is-clearfix"></div>
			</section>
		);
	}
}

export default NewTransaction;
