import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "./navbar.css";

const Navbar = () => {
	const network = useSelector(state => state.blockchain.network);
	const keys = useSelector(state => state.wallet.keys);
	return (
		<nav className="navbar is-dark" role="navigation" aria-label="main navigation">
			<section
				className="has-background-dark has-text-centered is-flex is-justify-content-space-evenly is-hidden-desktop"
				style={{ position: "fixed", zIndex: 100, bottom: 0, width: "100vw" }}
			>
				<Link to="/overview" className="has-text-white nav-mobile p-2" style={{ flexBasis: "20%" }}>
					<span className="material-icons-outlined md-28 mb-0" style={{ color: "white" }}>
						explore
					</span>
					<p className="is-size-7">Explore</p>
				</Link>
				<Link
					to="/blockchain"
					className="has-text-white nav-mobile p-2"
					style={{ flexBasis: "20%" }}
				>
					<span className="material-icons-outlined is-white md-28 mb-0" style={{ color: "white" }}>
						view_in_ar
					</span>
					<p className="is-size-7">Blockchain</p>
				</Link>

				<Link
					to={`/address/${keys.address}`}
					className="has-text-white nav-mobile p-2"
					style={{ flexBasis: "20%" }}
				>
					<span className="material-icons-outlined is-white md-28 mb-0" style={{ color: "white" }}>
						account_balance_wallet
					</span>
					<p className="is-size-7">Wallet</p>
				</Link>

				<Link
					to="/new-transaction"
					className="has-text-white nav-mobile p-2"
					style={{ flexBasis: "20%" }}
				>
					<span className="material-icons-outlined is-white md-28 mb-0" style={{ color: "white" }}>
						payments
					</span>
					<p className="is-size-7">Payment</p>
				</Link>

				<Link
					className="has-text-white nav-mobile p-2 more-button"
					style={{ flexBasis: "20%", position: "relative" }}
				>
					<span className="material-icons-outlined is-white md-28 mb-0" style={{ color: "white" }}>
						more_horiz
					</span>
					<p className="is-size-7">More</p>
					<div className="more-dropdown has-background-dark" role="menu">
						<p className="subtitle is-7 mb-3 has-text-white">
							Currently connected to the{" "}
							<strong className="has-text-success">
								{network === "mainnet" ? "MainNet" : "TestNet"}
							</strong>
						</p>
						<div className="is-flex is-flex-wrap-wrap">
							<Link
								to="/settings"
								className="has-text-white nav-mobile p-2"
								style={{ flexGrow: 1 }}
							>
								<span className="material-icons-outlined is-white md-28 mb-0">settings</span>
								<p className="is-size-7">Settings</p>
							</Link>

							<Link to="/mine" className="has-text-white nav-mobile p-2" style={{ flexGrow: 1 }}>
								<span className="material-icons-outlined is-white md-28 mb-0">engineering</span>
								<p className="is-size-7">Mine</p>
							</Link>

							<Link
								to="/generate-key"
								className="has-text-white nav-mobile p-2"
								style={{ flexGrow: 1 }}
							>
								<span className="material-icons-outlined is-white md-28 mb-0">vpn_key</span>
								<p className="is-size-7">Generate Key</p>
							</Link>
						</div>
					</div>
				</Link>
			</section>

			<div className="navbar-brand">
				<Link className="navbar-item mr-2" to="/">
					<span className="material-icons-outlined mr-2">monetization_on</span>
					<h1 className="has-text-weight-semibold">BobCoin (XBC)</h1>
					{/* <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt="logo" /> */}
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
						New Transaction
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

							<Link to={`/address/${keys.address}`} className="button has-text-weight-bold mr-3">
								<span className="material-icons-two-tone mr-2">account_balance_wallet</span>
								<span>My Wallet</span>
							</Link>

							<div className="dropdown is-right network-button">
								<button
									aria-haspopup="true"
									aria-controls="dropdown-menu6"
									className="dropdown-trigger button is-dark px-2 mx-0"
								>
									<span className="material-icons md-28">
										{network === "mainnet" ? "language" : "bug_report"}
									</span>
									<div className="indicator has-background-success"></div>
								</button>
								<div className="dropdown-menu network-dropdown" id="dropdown-menu6" role="menu">
									<div className="dropdown-content fhas-text-right">
										<div className="dropdown-item">
											<p>
												Currently connected to the{" "}
												<strong>{network === "mainnet" ? "MainNet" : "TestNet"}</strong>
											</p>
										</div>
										<hr className="dropdown-divider"></hr>
										<Link to="/settings" className="dropdown-item is-flex is-align-items-center">
											<span className="material-icons-outlined mr-2 md-18">settings</span>
											<p className="">Settings</p>
										</Link>
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
