import React, { Component } from "react";
import Transaction from "../components/transaction";
import { connect } from "react-redux";

class Mempool extends Component {
	state = {
	};
	render() {
		return (
			<div>
				{this.props.mempool.map((transaction, index) => (
					<div key={index} className="mb-2">
						<Transaction transaction={transaction}></Transaction>
					</div>
				))}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	transactions: state.blockchain.transactions,
});

export default connect(mapStateToProps)(Mempool);
