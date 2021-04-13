import React, { Component } from "react";
import Blockchain from "../components/blockchain";
import Mempool from "../components/mempool";
import { mineTransactions } from "../actions";
import { connect } from "react-redux";

class Mine extends Component {
	state = {};
	startMining = () => {
		this.props.mineTransactions("gooba");
	};
	render() {
		return (
			<section className="section">
				<h1 className="title is-2">Mine</h1>
				<p className="subtitle is-4">
					From the comfort of your browser! No need for unnessasary mining clients.
				</p>
				<div className="columns is-vcentered">
					<div className="column is-narrow mb-0">
						<button onClick={this.startMining} className="button mb-0">
							Start mining
						</button>
					</div>
					<div className="column is-10">
						<Blockchain style={{ width: "100%" }} className=""></Blockchain>
					</div>
				</div>
				<Mempool></Mempool>
			</section>
		);
	}
}

export default connect(undefined, { mineTransactions })(Mine);
