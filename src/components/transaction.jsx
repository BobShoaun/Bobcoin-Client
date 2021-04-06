import React, { Component } from "react";

class Transaction extends Component {
	render() {
		return (
			<div className="card card-content m-0">
				<h3 className="title is-6 mb-2 is-inline-block">Hash: &nbsp;</h3>
				<a href="/" className="subtitle is-6 mb-2 is-inline-block">
					{this.props.transaction.hash}
				</a>
				<div className="columns">
					<div className="column">
						<span>{this.props.transaction.sender}</span>
					</div>
					<div className="column is-narrow">
						<i className="material-icons">arrow_right_alt</i>
					</div>
					<div className="column">
						<span>{this.props.transaction.recipient}</span>
					</div>
					<div className="column is-narrow">
						<span className="subtitle is-6">Amount (BBC): &nbsp;</span>
						<span className="title is-6">{this.props.transaction.amount} BBC</span>
						<p>
							<span className="subtitle is-6">Fee (BBC): &nbsp;</span>
							<span className="title is-6">{this.props.transaction.fee} BBC</span>
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Transaction;
