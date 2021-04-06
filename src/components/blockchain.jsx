import React, { Component } from "react";
import Block from "../components/block";

class Blockchain extends Component {
	state = {
		chain: [
			{
				hash: "312312321231",
				previousHash: "fsdfd223423asdfa",
				miner: "adsifiuoeoijadfoajig",
				nonce: "",
				timestamp: new Date(),
			},
			{
				hash: "312312321231",
				previousHash: "fsdfd223423asdfa",
				miner: "adsifiuoeoijadfoajig",
				nonce: "",
				timestamp: new Date(),
			},
			{
				hash: "312312321231",
				previousHash: "fsdfd223423asdfa",
				miner: "adsifiuoeoijadfoajig",
				nonce: "",
				timestamp: new Date(),
			},
			{
				hash: "312312321231",
				previousHash: "fsdfd223423asdfa",
				miner: "adsifiuoeoijadfoajig",
				nonce: "",
				timestamp: new Date(),
			},
		],
	};
	render() {
		return (
			<div className="columns" style={{ overflowX: "auto" }}>
				{this.state.chain.map((block, index) => (
					<div key={index} className="column">
						<Block block={block} index={index} className=""></Block>
					</div>
				))}
			</div>
		);
	}
}

export default Blockchain;
