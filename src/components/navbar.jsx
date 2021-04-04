import React, { Component } from "react";

class Navbar extends Component {
	state = {};
	render() {
		return (
			<nav className="navbar is-primary" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
					<a className="navbar-item" href="https://bulma.io">
						<img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
					</a>

					<a
						role="button"
						className="navbar-burger"
						aria-label="menu"
						aria-expanded="false"
						data-target="navbarBasicExample"
					>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>

				<div id="navbarBasicExample" className="navbar-menu">
					<div className="navbar-start">
						<a className="navbar-item">Overview</a>

						<a className="navbar-item">Blockchain</a>
						<a className="navbar-item">Transactions</a>
						<a className="navbar-item">Mine</a>

						{/* <div className="navbar-item has-dropdown is-hoverable">
							<a className="navbar-link">More</a>

							<div className="navbar-dropdown">
								<a className="navbar-item">About</a>
								<a className="navbar-item">Jobs</a>
								<a className="navbar-item">Contact</a>
								<hr className="navbar-divider" />
								<a className="navbar-item">Report an issue</a>
							</div>
						</div> */}
					</div>

					<div className="navbar-end">
						<div className="navbar-item">
							<div className="buttons">
								<a className="button is-primary">
									<strong>Sign up</strong>
								</a>
                
					
								<a className="button is-light has-text-weight-bold">
                <span class="icon material-icons">account_balance_wallet</span>
                <span>My Wallet</span>
                  </a>
							</div>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}

export default Navbar;
