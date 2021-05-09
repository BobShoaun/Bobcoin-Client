import React from "react";
import { Link } from "react-router-dom";

const Block = ({ block }) => (
	<div className="card">
		<div className="card-header">
			<div className="card-header-title">
				<h1 className="title is-6 mb-0">
					Block #{block.height}
					{block.height === 0 && <span className="subtitle is-6"> (Genesis)</span>}
				</h1>
			</div>
			{/* <div className="column">{(new Date(this.props.block.timestamp)).toISOString?.() || 'no date'}</div> */}
		</div>
		<div className="card-content">
			<h3 className="subtitle is-6 mb-1">Hash</h3>
			<p className="subtitle is-7">
				<Link to={`/block/${block.hash}`}>{block.hash}</Link>
			</p>

			<h3 className="subtitle is-6 mb-1">Previous hash</h3>
			<p className="subtitle is-7">
				<Link to={`/block/${block.previousHash}`}>{block.previousHash ?? "-"}</Link>
			</p>

			<h3 className="subtitle is-6 mb-1">Miner</h3>
			<p className="subtitle is-7">
				<Link to={`/wallet/${block.miner}`}>{block.miner ?? "-"}</Link>
			</p>
			<Link to={`/block/${block.hash}`} className="button">
				View
			</Link>
		</div>
	</div>
);

export default Block;
