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
			<div>
        
				<h1 className="title is-4">Hash</h1>
        <p>{this.state.hash}</p>
        <h1>Hash of previous block</h1>
        <p>{this.state.previousHash}</p>
				<button className="button">Button</button>
			</div>
		);
	}
}

export default Block;
