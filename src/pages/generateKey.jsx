import React, { Component } from "react";
import { generateKeyPair, getKeyPair } from "blockchain-crypto";

class GenerateKey extends Component {
	state = {
		privateKey: "",
		publicKey: "",
	};
	render() {
		return (
			<section className="section">
				<h1 className="title is-2">Generate Key</h1>
				<div className="field">
					<label className="label">Private / Secret key</label>
					<div className="field has-addons mb-0">
						<div className="control is-expanded">
							<input
								className="input"
								type="text"
								placeholder="Enter or auto-generate private key"
								value={this.state.privateKey}
								onChange={({ target }) => this.handleChangePrivateKey(target.value)}
							></input>
						</div>
						<p className="control">
							<a className="button is-light">
								<i className="material-icons md-18">content_copy</i>
							</a>
						</p>
					</div>
					<p className="help is-danger">
						As the name suggest, this key should be kept private and stored in a safe place.
					</p>
				</div>

				<div className="field">
					<label className="label">Public key / Address</label>
					<div className="field has-addons mb-0">
						<div className="control is-expanded">
							<input className="input" type="text" value={this.state.publicKey} readOnly />
						</div>
						<p className="control">
							<a className="button is-light">
								<i className="material-icons md-18">content_copy</i>
							</a>
						</p>
					</div>
					<p className="help is-primary">This is used as an address to send and receive BBC.</p>
				</div>

				<div className="buttons is-pulled-right">
					<button onClick={this.generate} className="button is-warning">
						Generate random key
					</button>
					<button className="button is-info">Save & Use key</button>
				</div>
				<div className="is-clearfix"></div>
			</section>
		);
	}

	generate = () => {
		const keypair = generateKeyPair();
		this.setState({ privateKey: keypair.getPrivate("hex"), publicKey: keypair.getPublic("hex") });
	};

	handleChangePrivateKey = privateKey => {
		try {
			this.setState({ privateKey, publicKey: getKeyPair(privateKey).getPublic("hex") });
		} catch (ex) {
			this.setState({ privateKey: "", publicKey: "" });
		}
	};
}

export default GenerateKey;
