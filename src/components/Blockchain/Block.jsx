import React from "react";
import { Link } from "react-router-dom";

import { format } from "date-fns";

import { RESULT } from "blockcrypto";
import "./block.css";

const Block = ({ block, status, selected, validation }) => {
	return (
		<div
			className={`card is-flex is-flex-direction-column h-100 block ${
				selected ? "block-selected" : ""
			}`}
		>
			<div className="card-header" style={{ borderRadius: 0 }}>
				<div className="card-header-title">
					<h1 className="title is-6 mb-0 has-text-dark">
						Block #{block.height}
						{block.height === 0 && <span className="subtitle is-6 mb-0"> (Genesis)</span>}
					</h1>
					{validation.code === RESULT.VALID ? (
						<div className="icon has-text-info ml-auto">
							<i className="material-icons-two-tone">check_circle_outline</i>
						</div>
					) : (
						<div className="icon has-text-danger ml-auto">
							<i className="material-icons">dangerous</i>
						</div>
					)}
				</div>
			</div>
			<div
				className="card-content is-flex is-flex-direction-column p-4"
				style={{ flex: "1", fheight: "100%" }}
			>
				<div className="">
					<h3 className="title is-7 has-text-grey">Hash</h3>
					<p className="subtitle is-7 is-spaced mb-4 truncated">
						<Link to={`/block/${block.hash}`}>{block.hash}</Link>
					</p>

					<h3 className="title is-7 has-text-grey">Previous Block</h3>
					<p className="subtitle is-7 is-spaced mb-4 truncated">
						<Link to={`/block/${block.previousHash}`}>{block.previousHash ?? "-"}</Link>
					</p>

					<h3 className="title is-7 has-text-grey">Status</h3>
					<p className="subtitle is-7 is-spaced mb-4">{status}</p>

					<h3 className="title is-7 has-text-grey">Timestamp</h3>
					<p className="subtitle is-7 is-spaced mb-4">
						{format(block.timestamp, "eee, d MMM yyyy, HH:mm:ss")}
					</p>

					<h3 className="title is-7 has-text-grey">Miner</h3>
					<p className="subtitle is-7 is-spaced mb-4 truncated">
						<Link to={`/address/${block.transactions[0].outputs[0].address}`}>
							{block.transactions[0].outputs[0].address ?? "-"}
						</Link>
					</p>
				</div>
				<Link
					to={`/block/${block.hash}`}
					className="button is-block is-small mt-auto is-info has-text-weight-semibold"
				>
					View
				</Link>
			</div>
		</div>
	);
};

export default Block;
