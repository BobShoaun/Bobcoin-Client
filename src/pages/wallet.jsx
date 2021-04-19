import React, { Component } from "react";
import { connect } from "react-redux";

class Wallet extends Component {
	state = {
		inputPublicKey: this.props.match.params.publicKey,
	};
	render() {
		const publicKey = this.props.match.params.publicKey;
		return (
			<section className="section">
				<h1 className="title is-2">Wallet</h1>
				<p className="subtitle is-4">See this wallets balance and details.</p>

				<div className="field">
					<label className="label">Public key</label>
					<div className="field has-addons">
						<div className="control is-expanded">
							<input
								value={this.state.inputPublicKey}
								onChange={({ target }) => this.setState({ inputPublicKey: target.value })}
								className="input"
								type="text"
								placeholder="Input miner's key"
							></input>
							<p className="help">The public key of the miner, where to send block reward.</p>
						</div>
						<div className="control">
							<a href={`/wallet/${this.state.inputPublicKey}`} className="button is-info">Search</a>
						</div>
					</div>
				</div>

				<h2 className="subtitle is-4">Public key: {publicKey || '-'}</h2>
				<p className="subtitle is-5">
					Balance: {parseFloat(this.props.cryptocurrency.getBalance(publicKey)) || "-"} BBC
				</p>
			</section>
		);
	}
}

const mapStateToProps = state => ({
	cryptocurrency: state.blockchain,
});

export default connect(mapStateToProps)(Wallet);
// export default Wallet;
