import React, { Component } from "react";

class Footer extends Component {
	state = {};
	render() {
		return (
			<footer className="footer">
				<div className="content has-text-centered">
					<p>Disclaimer: This is not a real cryptocurrency. It is not secure.</p>
					<p>
						<strong>Bobcoin</strong> by <a href="https://bobng.me" >Ng Bob Shoaun</a>.
					</p>
				</div>
			</footer>
		);
	}
}

export default Footer;
