import React, { Component } from "react";

class GenerateKey extends Component {
	state = {};
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
							<input
								className="input"
								type="text"
								value="23423534f35445g4545tg4tg4e5y4g"
								readOnly
							/>
						</div>
						<p className="control">
							<a className="button is-light">
								<i className="material-icons md-18">content_copy</i>
							</a>
						</p>
					</div>
					<p className="help is-primary">
						This is used as an address to send and receive BBC.
					</p>
				</div>

				<div className="buttons is-pulled-right">
					<button className="button is-warning">Generate new key</button>
					<button className="button is-info">Save & Use key</button>
				</div>
				<div className="is-clearfix"></div>
			</section>
		);
	}
}

export default GenerateKey;
