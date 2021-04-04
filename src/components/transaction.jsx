import React, { Component } from "react";

class Transaction extends Component {
	state = {};
	render() {
		return (
			<div className="card card-content columns m-0">
				<div className="column">
					<p className="subtitle is-7">from: </p>
				</div>
				<div className="column">
					<p className="subtitle is-7">to: </p>
				</div>
			</div>
		);
	}
}

export default Transaction;
