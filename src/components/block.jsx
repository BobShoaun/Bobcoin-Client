import React, { Component } from "react";

class Block extends Component {
	state = {
		hash: "312312321231",
		previousHash: "fsdfd223423asdfa",
    miner: "adsifiuoeoijadfoajig",
		nonce: "",
		timestamp: new Date(),
	};
	render() {
		return (
			<div className="card">
				<div className="card-header">
					<h1 className="card-header-title">Block #1</h1>
          <div className="column">{this.state.timestamp.toISOString()}</div>
				</div>
				<div className="card-content">
					<h3 className="subtitle is-6 mb-1">Hash</h3>
					<p className="subtitle is-7">
						<a href="/">{this.state.hash}</a>
					</p>
					<h3 className="subtitle is-6 mb-1">Previous block hash</h3>
          <p className="subtitle is-7">
						<a href="/">{this.state.previousHash}</a>
					</p>
          <h3 className="subtitle is-6 mb-1">Miner</h3>
          <p className="subtitle is-7">
						<a href="/">{this.state.miner}</a>
					</p>
					<button className="button">View</button>
				</div>
			</div>
		);
	}
}

export default Block;
