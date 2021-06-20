import React from "react";
import { Link } from "react-router-dom";

import { useBlockchain } from "../hooks/useBlockchain";

import Blockchain from "../components/Blockchain";
import Mempool from "../components/Mempool";
import Loading from "../components/Loading";

const DashboardPage = () => {
	const [loading, params] = useBlockchain();
	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	return (
		<section className="section">
			<div className="is-flex-tablet">
				<div className="mb-3">
					<h1 className="title is-2 mb-1">Overview</h1>
					<div className="is-flex">
						<span className="material-icons mr-2 my-auto">monetization_on</span>
						<h2 className="subtitle is-4">
							{params.name} {params.symbol}
						</h2>
					</div>
				</div>
				<div className="ml-auto field mb-4" style={{ minWidth: "15em" }}>
					<p className="control has-icons-left">
						<input className="input" type="search" placeholder="Search" />
						<span className="icon is-left is-small">
							<i className="material-icons">search</i>
						</span>
					</p>
				</div>
			</div>
			<hr className="mb-6 mt-3" />

			<div className="is-flex is-flex-wrap-wrap mb-3">
				<div>
					<h2 className="title is-4">Blockchain</h2>
					<p className="subtitle is-6">Most recently mined blocks in the blockchain.</p>
				</div>
				<Link to="./blockchain" className="button is-secondary ml-auto has-text-weight-semibold">
					<span className="material-icons mr-2">grid_view</span>
					<span>View all Blocks</span>
				</Link>
			</div>
			<div className="mb-6" style={{ overflow: "auto" }}>
				<Blockchain />
			</div>

			<div className="is-flex is-flex-wrap-wrap mb-4">
				<div>
					<h2 className="title is-4">Mempool - Pending transactions</h2>
					<p className="subtitle is-6">All pending transactions that are unconfirmed.</p>
				</div>
				<Link
					to="/new-transaction"
					className="button is-secondary ml-auto has-text-weight-semibold"
				>
					<span className="material-icons mr-2">attach_money</span>
					<span>Make Transaction</span>
				</Link>
			</div>
			<Mempool />
		</section>
	);
};

export default DashboardPage;
