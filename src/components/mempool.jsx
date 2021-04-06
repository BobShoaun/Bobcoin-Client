import React, { Component } from "react";
import Transaction from "../components/transaction";

class Mempool extends Component {
	state = {
		transactions: [
			{
				hash: "fdiasudfioafoiweuiweug2340823",
				sender: "3094f9e8u3q98uf9348f342fae34fq34f",
				recipient: "fiu34f394873n498vfn739487f3f",
				amount: 123.34,
				fee: 0,
			},
			{
				hash: "fdiasudfioafoiweuiweug2340823",
				sender: "3094f9e8u3q98uf9348f342fae34fq34f",
				recipient: "fiu34f394873n498vfn739487f3f",
				amount: 123.34,
				fee: 0,
			},
			{
				hash: "fdiasudfioafoiweuiweug2340823",
				sender: "3094f9e8u3q98uf9348f342fae34fq34f",
				recipient: "fiu34f394873n498vfn739487f3f",
				amount: 123.34,
				fee: 0,
			},
		],
	};
	render() {
		return (
			<div>
				{this.state.transactions.map((transaction, index) => (
					<div key={index} className="mb-2">
						<Transaction transaction={transaction}></Transaction>
					</div>
				))}
			</div>
		);
	}
}

export default Mempool;
