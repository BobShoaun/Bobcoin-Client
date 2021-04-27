import React, { Component } from "react";

class Block extends Component {
	// state = {
	// 	hash: "312312321231",
	// 	previousHash: "fsdfd223423asdfa",
	//   miner: "adsifiuoeoijadfoajig",
	// 	nonce: "",
	// 	timestamp: new Date(),
	// };
	render() {
		return (
			<div className="card">
				<div className="card-header">
					<div className="card-header-title">
						<h1 className="title is-6 mb-0">
							Block #{this.props.block.height}
							{this.props.block.height === 0 && <span className="subtitle is-6"> (Genesis)</span>}
						</h1>
					</div>
					{/* <div className="column">{(new Date(this.props.block.timestamp)).toISOString?.() || 'no date'}</div> */}
				</div>
				<div className="card-content">
					<h3 className="subtitle is-6 mb-1">Hash</h3>
					<p className="subtitle is-7">
						<a href={`/block/${this.props.block.hash}`}>{this.props.block.hash}</a>
					</p>

					<h3 className="subtitle is-6 mb-1">Previous hash</h3>
					<p className="subtitle is-7">
						<a href={`/block/${this.props.block.previousHash}`}>
							{this.props.block.previousHash || "-"}
						</a>
					</p>

					<h3 className="subtitle is-6 mb-1">Miner</h3>
					<p className="subtitle is-7">
						<a href={`/wallet/${this.props.block.miner}`}>{this.props.block.miner || "-"}</a>
					</p>
					<a href={`/block/${this.props.block.hash}`} className="button">
						View
					</a>
				</div>
			</div>
		);
	}
}

export default Block;
