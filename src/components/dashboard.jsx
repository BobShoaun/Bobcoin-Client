import React, { Component } from "react";
import Block from "./block";
import Transaction from "./transaction";

class Dashboard extends Component {
	state = {};
	render() {
		return (
			<section className="section">
				<h1 className="title is-2">Overview</h1>
				<div className="columns">
					<div className="column mr-2">
						<Block className=""></Block>
					</div>
					<div className="column mr-2">
						<Block className=""></Block>
					</div>
					<div className="column mr-2">
						<Block className=""></Block>
					</div>
				</div>
        <button class="button is-info is-pulled-right has-text-weight-semibold">
          <span class="icon material-icons">attach_money</span>
					<span>Create Transaction</span>
				</button>
				<h2 className="title is-3">Mempool - Pending transactions</h2>
        
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
