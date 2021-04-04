import React, { Component } from "react";

class Block extends Component {
  state = {
    hash: '312312321231',
    previousHash: "",
    nonce: "",
    timestamp: new Date()
  };
	render() {
		return (
			<div className="card card-content">
				<h1 className="title is-4">Block</h1>
        <p>hash: <a href="">{this.state.hash}</a></p>
        <h1>Hash of previous block</h1>
        <p>{this.state.previousHash}</p>
				<button className="button">Button</button>
			</div>
		);
	}
}

export default Block;
