import React, { Component } from "react";
import Block from "../components/block";
import { connect } from "react-redux";

class Blockchain extends Component {
	state = {
		// chain: [
		// 	{
		// 		hash: "312312321231",
		// 		previousHash: "fsdfd223423asdfa",
		// 		miner: "adsifiuoeoijadfoajig",
		// 		nonce: "",
		// 		timestamp: new Date(),
		// 	},
		// 	{
		// 		hash: "312312321231",
		// 		previousHash: "fsdfd223423asdfa",
		// 		miner: "adsifiuoeoijadfoajig",
		// 		nonce: "",
		// 		timestamp: new Date(),
		// 	},
		// 	{
		// 		hash: "312312321231",
		// 		previousHash: "fsdfd223423asdfa",
		// 		miner: "adsifiuoeoijadfoajig",
		// 		nonce: "",
		// 		timestamp: new Date(),
		// 	},
		// 	{
		// 		hash: "312312321231",
		// 		previousHash: "fsdfd223423asdfa",
		// 		miner: "adsifiuoeoijadfoajig",
		// 		nonce: "",
		// 		timestamp: new Date(),
		// 	},
		// ],
	};

	render() {
    let blockchain = [...this.props.blockchain];
    blockchain.sort((a, b) => a.height < b.height ? 1 : -1);
		return (
			<div className="columns" style={{ overflowX: "auto" }}>
				{blockchain.map((block, index) => (
					<div key={index} className="column is-3">
						<Block block={block} index={blockchain.length - index - 1} className=""></Block>
					</div>
				))}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	blockchain: state.blockchain.chain,
});

export default connect(mapStateToProps)(Blockchain);
