import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { isBlockValidInBlockchain } from "blockcrypto";

const Block = ({ block }) => {
	const params = useSelector(state => state.blockchain.params);
	const blockchain = useSelector(state => state.blockchain.chain);

	let isValid = false;
	try {
		isValid = isBlockValidInBlockchain(params, blockchain, block);
	} catch (e) {
		console.log(e);
	}

	return (
		<div className="card is-flex is-flex-direction-column h-100">
			<div className="card-header">
				<div className="card-header-title">
					<h1 className="title is-6 mb-0">
						Block #{block.height}
						{block.height === 0 && <span className="subtitle is-6"> (Genesis)</span>}
					</h1>
					{isValid ? (
						<div className="icon has-text-success ml-auto">
							<i className="material-icons">check_circle_outline</i>
						</div>
					) : (
						<div className="icon has-text-danger ml-auto">
							<i className="material-icons">dangerous</i>
						</div>
					)}
				</div>
			</div>
			<div
				className="card-content is-flex is-flex-direction-column"
				style={{ flex: "1", fheight: "100%" }}
			>
				<div className="mb-4">
					<h3 className="subtitle is-6 mb-1">Hash</h3>
					<p className="subtitle is-7">
						<Link to={`/block/${block.hash}`}>{block.hash}</Link>
					</p>

					<h3 className="subtitle is-6 mb-1">Previous Block</h3>
					<p className="subtitle is-7">
						<Link to={`/block/${block.previousHash}`}>{block.previousHash ?? "-"}</Link>
					</p>

					<h3 className="subtitle is-6 mb-1">Timestamp</h3>
					<p className="subtitle is-7">{new Date(block.timestamp).toString()}</p>

					<h3 className="subtitle is-6 mb-1">Miner</h3>
					<p className="subtitle is-7">
						<Link to={`/address/${block.transactions[0].outputs[0].address}`}>
							{block.transactions[0].outputs[0].address ?? "-"}
						</Link>
					</p>
				</div>
				<Link to={`/block/${block.hash}`} className="button is-block mt-auto is-info">
					View
				</Link>
			</div>
		</div>
	);
};

export default Block;
