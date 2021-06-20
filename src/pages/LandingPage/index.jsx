import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "./index.css";

const LandingPage = () => {
	const params = useSelector(state => state.consensus.params);

	return (
		<section className="section">
			<div className="has-text-centered mb-7 mt-6" style={{ fmargin: "6em 0" }}>
				<h1 className="title is-size-2 is-size-1-tablet is-spaced mb-4">
					Welcome to {params.name ?? "Bobcoin"}
				</h1>
				<p
					className="subtitle is-size-5 is-size-4-tablet is-spaced mb-6 mx-auto"
					style={{ maxWidth: "35em" }}
				>
					an open source, decentralized, peer to peer, blockchain, proof of work, digital currency
					that will take us to Mars.
				</p>
				<a
					href="https://github.com/BobShoaun/Blockchain-Crypto"
					target="_blank"
					className="button mr-3 has-text-weight-semibold"
				>
					<span className="material-icons-outlined mr-2">code</span>
					Source
				</a>
				<Link to="overview" className="button is-primary has-text-weight-semibold">
					<span className="material-icons-outlined mr-2">explore</span>
					Explore
				</Link>
			</div>
			<img className="rocket" src="images/rocket.jpg" alt="rocket" />
			<div className="-has-background-primary has-text-centered" style={{ margin: "5em 0 10em 0" }}>
				<h3 className="subtitle is-size-5 is-size-4-tablet" style={{ marginBottom: "4em" }}>
					Bobcoin boast many properties that makes it safe and sustainable:
				</h3>
				<div className="qualities-grid mx-7-tablet">
					<div className="-has-background-info has-text-white">
						<span className="material-icons-two-tone md-48 has-text-info">south</span>
						<h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">Low fees</h2>
						<p className="subtitle is-6">Send money globally at the cost of peanuts</p>
					</div>

					<div className="-has-background-info has-text-white">
						<span className="material-icons-two-tone md-48 has-text-info">emoji_emotions</span>
						<h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">Simple</h2>
						<p className="subtitle is-6">Easy to use, all you need is this client</p>
					</div>
					<div className="-has-background-info has-text-white">
						<span className="material-icons-two-tone md-48 has-text-info">terrain</span>
						<h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">High Supply Cap</h2>
						<p className="subtitle is-6">
							Up to {(params.hardCap / params.coin).toLocaleString()} {params.symbol} available
						</p>
					</div>
					<div className="-has-background-info has-text-white">
						<span className="material-icons-two-tone md-48 has-text-info">trending_up</span>
						<h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">Big Rewards</h2>
						<p className="subtitle is-6">
							Get {params.initBlkReward / params.coin} {params.symbol} for each block mined
						</p>
					</div>
					<div className="-has-background-info has-text-white">
						<span className="material-icons-two-tone md-48 has-text-info">monetization_on</span>
						<h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">Inspired by Bitcoin</h2>
						<p className="subtitle is-6">Implemented following bitcoin's algorithms</p>
					</div>
				</div>
			</div>

			<div className="has-text-centered mb-6">
				<h1 className="title is-size-5 is-size-4-tablet mb-2 is-spaced">
					What are you waiting for?
				</h1>
				<p className="subtitle is-size-6 is-size-5-tablet">Start investing in bobcoins</p>
				<hr />
			</div>
			<ol className="subtitle is-5 pl-3 px-6-tablet" style={{ marginBottom: "5em" }}>
				<li className="mb-5 is-size-6 is-size-5-tablet">
					<div className="is-flex">
						<p>Generate a private key and address.</p>
						<Link
							to="generate-key"
							className="button is-small is-info ml-auto has-text-weight-semibold px-4"
						>
							<span className="material-icons-outlined md-28">arrow_right_alt</span>
						</Link>
					</div>
				</li>
				<li className="mb-5 is-size-6 is-size-5-tablet">
					<div className="is-flex">
						<p className="">Obtain XBC by mining, or ask the creator himself for some coins.</p>
						<Link
							to="mine"
							className="button is-small is-info ml-auto has-text-weight-semibold px-4"
						>
							<span className="material-icons-outlined md-28">arrow_right_alt</span>
						</Link>
					</div>
				</li>
				<li className="mb-5 is-size-6 is-size-5-tablet">
					<div className="is-flex">
						<p>Check your wallet for balance so you don't go broke!</p>
						<Link
							to="wallet"
							className="button is-small is-info ml-auto has-text-weight-semibold px-4"
						>
							<span className="material-icons-outlined md-28">arrow_right_alt</span>
						</Link>
					</div>
				</li>
				<li className="mb-5 is-size-6 is-size-5-tablet">
					<div className="is-flex">
						<p>Make global transactions to anyone.</p>
						<Link
							to="new-transaction"
							className="button is-small is-info ml-auto has-text-weight-semibold px-4"
						>
							<span className="material-icons-outlined md-28">arrow_right_alt</span>
						</Link>
					</div>
				</li>
				<li className="mb-5 is-size-6 is-size-5-tablet">
					<div className="is-flex">
						<p>
							Host your own node with a copy of the blockchain, and become a valuable peer in the
							network. (coming soon)
						</p>
					</div>
				</li>
			</ol>
		</section>
	);
};

export default LandingPage;
