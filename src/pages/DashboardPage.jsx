import React from "react";
import { Link } from "react-router-dom";

import { useBlockchain } from "../hooks/useBlockchain";

import Blockchain from "../components/Blockchain";
import Mempool from "../components/Mempool";

const DashboardPage = () => {
	const [loading, params] = useBlockchain();
	if (loading) return null;

	return (
		<section className="section">
			<div className="columns mb-4">
				<div className="column">
					<h1 className="title is-2">Overview</h1>
				</div>

				<div className="field column is-narrow" style={{ minWidth: "20em" }}>
					<p className="control has-icons-left">
						<input className="input" type="search" placeholder="Search" />
						<span className="icon is-left is-small">
							<i className="material-icons">search</i>
						</span>
					</p>
				</div>
			</div>

			<span className="material-icons mr-2">monetization_on</span>
			<h2 className="subtitle is-3 is-inline-block">
				{params.name} {params.symbol}
			</h2>
			<div>
				<Link
					to="./blockchain"
					className="button is-secondary is-pulled-right has-text-weight-semibold"
				>
					<span className="material-icons mr-2">grid_view</span>
					<span>View all Blocks</span>
				</Link>
				<h2 className="title is-4">Blockchain</h2>
				<p className="subtitle is-5">Most recently mined blocks in the blockchain.</p>
			</div>
			<hr />
			<div className="mb-6" style={{ overflow: "auto" }}>
				<Blockchain />
			</div>

			<Link
				to="/new-transaction"
				className="button is-secondary is-pulled-right has-text-weight-semibold"
			>
				<span className="material-icons mr-2">attach_money</span>
				<span>Make Transaction</span>
			</Link>
			<h2 className="title is-4">Mempool - Pending transactions</h2>
			<p className="subtitle is-5">All pending transactions that are unconfirmed.</p>
			{/* <div className="is-clearfix"></div> */}
			<hr />
			<Mempool></Mempool>
		</section>
	);
};

export default DashboardPage;
