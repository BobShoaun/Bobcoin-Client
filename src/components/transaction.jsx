import React, { Component } from "react";


class Transaction extends Component {
	render() {
		const keyText = {
			maxWidth: "",
			display: "block",
			whiteSpace: "pre-wrap",
			wordWrap: "break-word",
		};
    const signatureText = {
      display: "block",
      maxWidth: "50rem",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
		};
		return (
			<div className="card card-content m-0">
				<div>
					<h3 className="title is-6 mb-2 is-inline-block">Hash: &nbsp;</h3>
					<a href="/" className="subtitle is-6">
						{this.props.transaction.hash || "no hash"}
					</a>
				</div>
				<div className="is-flex is-justify-content-start is-align-items-baseline">
					<h3 className="title is-6 mb-2">Signature: &nbsp;</h3>
					<p style={signatureText} className="subtitle is-6 mb-0">
						{this.props.transaction.signature}
					</p>
				</div>

				<div className="columns">
					<div className="column is-4">
						<span style={keyText}>{this.props.transaction.sender || 'coinbase'}</span>
					</div>
					<div className="column is-narrow">
						<i className="material-icons">arrow_right_alt</i>
					</div>
					<div className="column is-4">
						<span style={keyText}>{this.props.transaction.recipient}</span>
					</div>
					<div className="column is-offset-1">
						<span className="subtitle is-6">Amount: &nbsp;</span>
						<span className="title is-6">{this.props.transaction.amount} BBC</span>
						<p>
							<span className="subtitle is-6">Fee: &nbsp;</span>
							<span className="title is-6">{this.props.transaction.fee} BBC</span>
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Transaction;
