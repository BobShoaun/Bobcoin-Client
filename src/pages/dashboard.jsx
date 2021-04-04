import React, { Component } from "react";
import Block from "../components/block";
import Transaction from "../components/transaction";

class Dashboard extends Component {
	state = {};
	render() {
		return (
			<section className="section">
        <div className="columns mb-4">
          <div className="column">

				<h1 className="title is-2">Overview</h1>
          </div>

        <div className="field column is-narrow" style={{minWidth: '20em'}}>
					<p className="control has-icons-left">
						<input className="input" type="search" placeholder="Search" />
						<span className="icon is-left is-small">
							<i className="material-icons">search</i>
						</span>
					</p>
				</div>
        </div>
			
				<span className="material-icons mr-2">monetization_on</span>
				<h2 className="subtitle is-3 is-inline-block">Bobcoin BBC</h2>
				<div>
					<button className="button is-info is-pulled-right has-text-weight-semibold">
						<span className="icon material-icons">grid_view</span>
						<span>View All Blocks</span>
					</button>
					<h2 className="title is-4">Blockchain</h2>
					<p className="subtitle is-5">All blocks in the blockchain.</p>
				</div>
				<hr />
				<div className="columns mb-6" style={{ overflowX: "auto" }}>
					<div className="column">
						<Block className=""></Block>
					</div>
					<div className="column">
						<Block className=""></Block>
					</div>
					<div className="column">
						<Block className=""></Block>
					</div>
					<div className="column">
						<Block className=""></Block>
					</div>
					<div className="column">
						<Block className=""></Block>
					</div>
					<div className="column">
						<Block className=""></Block>
					</div>
				</div>
				<button className="button is-info is-pulled-right has-text-weight-semibold">
					<span className="icon material-icons">attach_money</span>
					<span>Create Transaction</span>
				</button>
				<h2 className="title is-4">Mempool - Pending transactions</h2>
				<p className="subtitle is-5">All pending transactions that are unconfirmed.</p>
				{/* <div className="is-clearfix"></div> */}
				<hr />
				<div className="mb-2">
					<Transaction></Transaction>
				</div>
				<div className="mb-2">
					<Transaction></Transaction>
				</div>{" "}
				<div className="mb-2">
					<Transaction></Transaction>
				</div>
			</section>
		);
	}
}

export default Dashboard;
