import React, { Component } from "react";

class GenerateKey extends Component {
	state = {};
	render() {
		return (
			<section className="section">
				<h1 className="title is-2">Generate Key</h1>
        <button className="button">Generate new key</button>
        <button className="button">Save & Use key</button>
			</section>
		);
	}
}

export default GenerateKey;
