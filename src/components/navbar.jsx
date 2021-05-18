import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
	<nav className="navbar is-primary" role="navigation" aria-label="main navigation">
		<div className="navbar-brand">
			<Link className="navbar-item" to="/">
				<img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt="logo" />
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
				<Link to="/" className="navbar-item">
					Overview
				</Link>

				<Link to="/blockchain" className="navbar-item">
					Blockchain
				</Link>
				<Link to="/transactions" className="navbar-item">
					Transactions
				</Link>
				<Link to="/mine" className="navbar-item">
					Mine
				</Link>
			</div>

			<div className="navbar-end">
				<div className="navbar-item">
					<div className="buttons">
						<Link to="/generate-key" className="button is-warning">
							<span className="icon material-icons">vpn_key</span>
							<strong>Generate Key</strong>
						</Link>

						<Link
							to={`/wallet/${localStorage.getItem("pk")}`}
							className="button is-light has-text-weight-bold"
						>
							<span className="icon material-icons">account_balance_wallet</span>
							<span>My Wallet</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	</nav>
);

export default Navbar;
