import React from "react";
import { Link } from "react-router-dom";

import { useParams } from "../../hooks/useParams";

import Blockchain from "../../components/Blockchain/";
import Mempool from "../../components/Mempool";
import Loading from "../../components/Loading";

import "./index.css";

const OverviewPage = () => {
	const [loading, params] = useParams();

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
					<h1 className="title is-size-4 is-size-2-tablet mb-1">Overview</h1>
					<div className="is-flex">
						<span className="material-icons mr-2 my-auto ticker">monetization_on</span>
						<h2 className="subtitle is-size-5 is-size-4-tablet">
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

			<div className="is-flex is-flex-wrap-wrap mb-3" style={{ gap: ".5em" }}>
				<div>
					<h2 className="title is-size-5 is-size-4-tablet">Blocks - Recently mined</h2>
					<p className="subtitle is-size-6">Most recently mined blocks in the blockchain.</p>
				</div>
				<Link to="./blockchain" className="button is-secondary ml-auto has-text-weight-semibold">
					<span className="material-icons mr-2">view_in_ar</span>
					<span>View all Blocks</span>
				</Link>
			</div>
			<div className="mb-6" style={{ overflow: "auto" }}>
				<Blockchain />
			</div>

			<div className="is-flex is-flex-wrap-wrap mb-4" style={{ gap: ".5em" }}>
				<div>
					<h2 className="title is-size-5 is-size-4-tablet">Mempool - Pending transactions</h2>
					<p className="subtitle is-size-6">
						All unconfirmed transactions that are waiting to be put into blocks.
					</p>
				</div>
				<Link
					to="/transaction/create"
					className="button is-secondary ml-auto has-text-weight-semibold"
				>
					<span className="material-icons mr-2">send</span>
					<span>Make Transaction</span>
				</Link>
			</div>
			<Mempool />
		</section>
	);
};

export default OverviewPage;
