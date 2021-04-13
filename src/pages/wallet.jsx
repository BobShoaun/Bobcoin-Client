import React, { Component } from "react";
import { connect } from "react-redux";

class Wallet extends Component {
	state = {};
	render() {
    const publicKey = this.props.match.params.publicKey;
		return (
			<section className="section">
				<h1 className="title is-2">Wallet</h1>
				<p className="subtitle is-4">See this wallets balance and details.</p>
        <h2 className="subtitle is-4">Public key: {publicKey}</h2>
				<p className="subtitle is-5">Balance: {parseFloat(this.props.cryptocurrency.getBalance(publicKey))}</p>
			</section>
		);
	}
}

const mapStateToProps = state => ({
	cryptocurrency: state.blockchain,
});

export default connect(mapStateToProps)(Wallet);
// export default Wallet;
