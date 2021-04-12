import React, { Component } from "react";
import Transaction from "../components/transaction";
import { connect } from "react-redux";

class Mempool extends Component {
	state = {
		// transactions: [
		// 	{
		// 		hash: "1fdiasudfioafoiweuiweug2340823",
		// 		sender: "3094f9e8u3q98uf9348f342fae34fq34f",
		// 		recipient: "fiu34f394873n498vfn739487f3f",
		// 		amount: 12323.34,
		// 		fee: 0,
		// 	},
		// 	{
		// 		hash: "223adsfsdfasdfasdfasdfasdf",
		// 		sender: "3094f9e8u3q98uf9348f342fae34fq34f",
		// 		recipient: "fiu34f394873n498vfn739487f3f",
		// 		amount: 1423.34,
		// 		fee: 0,
		// 	},
		// 	{
		// 		hash: "3fdiasudfioafoiweuiweug2340823",
		// 		sender: "3094f9e8u3q98uf9348f342fae34fq34f",
		// 		recipient: "fiu34f394873n498vfn739487f3f",
		// 		amount: 123543.34,
		// 		fee: 1,
		// 	},
		// ]
	};
	render() {
		return (
			<div>
				{this.props.transactions.map((transaction, index) => (
					<div key={index} className="mb-2">
						<Transaction transaction={transaction}></Transaction>
					</div>
				))}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	transactions: state.transactions,
});

export default connect(mapStateToProps)(Mempool);
