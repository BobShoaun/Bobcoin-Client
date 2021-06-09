import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
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
							<span className="material-icons mr-2">vpn_key</span>
							<p className="has-text-weight-semibold">Generate Key</p>
						</Link>

						<Link
							to={`/address/${localStorage.getItem("add")}`}
							className="button has-text-weight-bold"
						>
							<span className="material-icons mr-2">account_balance_wallet</span>
							<span>My Wallet</span>
						</Link>

						<Link to={`/settings`} className="button is-dark has-text-weight-bold">
							<span className="material-icons-outlined">settings</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	</nav>
);

export default Navbar;
