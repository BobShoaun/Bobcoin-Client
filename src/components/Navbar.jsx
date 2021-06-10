import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./navbar.css";

const Navbar = () => {
	const [dropdown, setDropdown] = useState(false);
	const testNet = false;

	return (
		<nav className="navbar is-dark" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<Link className="navbar-item mr-2" to="/">
					<span className="material-icons-outlined mr-2">monetization_on</span>
					<h1 className="has-text-weight-semibold">BobCoin (XBC)</h1>
					{/* <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt="logo" /> */}
				</Link>

				<Link
					to="/"
					role="button"
					className="navbar-burger"
					aria-label="menu"
					aria-expanded="false"
					data-target="navbarBasicExample"
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</Link>
			</div>

			<div id="navbarBasicExample" className="navbar-menu">
				<div className="navbar-start">
					<Link to="/overview" className="navbar-item has-text-weight-semi-bold mr-2">
						Overview
					</Link>

					<Link to="/blockchain" className="navbar-item mr-2">
						Blockchain
					</Link>
					<Link to="/new-transaction" className="navbar-item mr-2">
						Create Transaction
					</Link>
					<Link to="/mine" className="navbar-item mr-2">
						Mine
					</Link>
				</div>

				<div className="navbar-end">
					<div className="navbar-item">
						<div className="buttons">
							<Link to="/generate-key" className="button is-primary mr-3">
								<span className="material-icons-two-tone mr-2">vpn_key</span>
								<p className="has-text-weight-bold has-text-dark">Generate Key</p>
							</Link>

							<Link
								to={`/address/${localStorage.getItem("add")}`}
								className="button has-text-weight-bold mr-3"
							>
								<span className="material-icons-two-tone mr-2">account_balance_wallet</span>
								<span>My Wallet</span>
							</Link>

							<div class={`dropdown is-hoverable is-right ${dropdown ? "is-active" : ""}`}>
								<div class="dropdown-trigger">
									<button
										aria-haspopup="true"
										aria-controls="dropdown-menu6"
										// onClick={() => setDropdown(d => !d)}
										className="button is-dark px-2"
									>
										<span className="material-icons md-28">
											{testNet ? "bug_report" : "language"}
										</span>
										<div className="indicator has-background-success"></div>
									</button>
								</div>
								<div class="dropdown-menu" id="dropdown-menu6" role="menu">
									<div class="dropdown-content fhas-text-right">
										<div class="dropdown-item">
											<p>
												Currently connected to the <strong>MainNet</strong>
											</p>
										</div>
										<hr class="dropdown-divider"></hr>
										<Link to="/settings" class="dropdown-item">
											Settings
										</Link>
										<a href="#" class="dropdown-item">
											Wallets
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
