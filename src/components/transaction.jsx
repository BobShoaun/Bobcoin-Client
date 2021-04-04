import React, { Component } from "react";

class Transaction extends Component {
	state = {
    hash: "fdiasudfioafoiweuiweug2340823",
    from: "3094f9e8u3q98uf9348f342fae34fq34f",
    to: "fiu34f394873n498vfn739487f3f",
  };
	render() {
		return (
			<div className="card card-content m-0">
        <h3 className="title is-6 mb-2 is-inline-block">Hash: &nbsp;</h3>
        <a href="" className="subtitle is-6 mb-2 is-inline-block">{this.state.hash}</a>
        <div className="columns">
        <div className="column">
          <span>{this.state.from}</span>
				</div>
        <div className="column is-narrow">
          <i className="material-icons">arrow_right_alt</i>
        </div>
				<div className="column">
          <span>{this.state.to}</span>

				</div>
        </div>
			
			</div>
		);
	}
}

export default Transaction;
