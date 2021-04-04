import React, { Component } from "react";

class Footer extends Component {
	state = {};
	render() {
		return (
			<footer className="footer">
				<div className="content has-text-centered">
					<p>Disclaimer: This client relays information to peers through a centralized authoritative server.</p>
					<p>
						<strong>Bobcoin</strong> by <a href="https://bobng.me" >Ng Bob Shoaun</a>.
					</p>
				</div>
			</footer>
		);
	}
}

export default Footer;
