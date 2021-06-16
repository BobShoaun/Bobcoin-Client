import { assertTypeParameterInstantiation } from "@babel/types";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "./index.css";

const LandingPage = () => {
	const params = useSelector(state => state.consensus.params);

	return (
		<section className="section">
			<div className="has-text-centered" style={{ margin: "6em 0" }}>
				<h1 className="title is-1 is-spaced mb-4">Welcome to {params.name ?? "Bobcoin"}</h1>
				<p className="subtitle is-4 is-spaced mb-6 mx-auto" style={{ maxWidth: "35em" }}>
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
			<img
				className="is-block"
				style={{
					width: "70em",
					height: "24em",
					objectFit: "cover",
					margin: "4em auto",
					borderRadius: ".3rem",
				}}
				src="images/rocket.jpg"
				alt="rocket"
			/>
			<div
				className="-has-background-primary has-text-centered"
				style={{ margin: "5em 0 10em 0", flex: "1 0 1" }}
			>
				<h3 className="subtitle is-4 -has-text-white" style={{ marginBottom: "4em" }}>
					Bobcoin boast many properties that makes it safe and sustainable:
				</h3>
				<div className="is-flex is-justify-content-space-around" style={{ marginBottom: "5em" }}>
					<div className="-has-background-info has-text-white" style={{ flex: "1 0 1" }}>
						<span className="material-icons-two-tone md-48 has-text-info">south</span>
						<h2 className="title is-4 is-spaced mb-2">Low fees</h2>
						<p className="subtitle is-6">Send money globally at the cost of peanuts</p>
					</div>

					<div className="-has-background-info has-text-white" style={{ flex: "1 0 1" }}>
						<span className="material-icons-two-tone md-48 has-text-info">emoji_emotions</span>
						<h2 className="title is-4 is-spaced mb-2">Simple</h2>
						<p className="subtitle is-6">Easy to use, all you need is this client</p>
					</div>
					<div className="-has-background-info has-text-white" style={{ flex: "1 0 1" }}>
						<span className="material-icons-two-tone md-48 has-text-info">terrain</span>
						<h2 className="title is-4 is-spaced mb-2">High Supply Cap</h2>
						<p className="subtitle is-6">
							Up to {(params.hardCap / params.coin).toLocaleString()} {params.symbol} available
						</p>
					</div>
				</div>
				<div className="is-flex is-justify-content-space-evenly mb-6">
					<div className="-has-background-info has-text-white" style={{ flex: "1 0 1" }}>
						<span className="material-icons-two-tone md-48 has-text-info">trending_up</span>
						<h2 className="title is-4 is-spaced mb-2">Big Rewards</h2>
						<p className="subtitle is-6">
							Get {params.initBlkReward / params.coin} {params.symbol} for each block mined
						</p>
					</div>

					<div className="-has-background-info has-text-white" style={{ flex: "1 0 1" }}>
						<span className="material-icons-two-tone md-48 has-text-info">monetization_on</span>
						<h2 className="title is-4 is-spaced mb-2">Inspired by Bitcoin</h2>
						<p className="subtitle is-6">Implemented following bitcoin's algorithms</p>
					</div>
				</div>
			</div>

			<div className="has-text-centered mb-6">
				<h1 className="title is-3 mb-3 is-spaced">What are you waiting for?</h1>
				<p className="subtitle is-4">Start investing in bobcoins</p>
				<hr />
			</div>
			<ol className="mx-auto subtitle is-5 px-6" style={{ fwidth: "50em", marginBottom: "5em" }}>
				<li className="mb-5">
					Generate a private key and address
					<Link
						to="generate-key"
						className="button is-small is-info is-pulled-right has-text-weight-semibold px-4"
					>
						<span className="material-icons-outlined md-28">arrow_right_alt</span>
					</Link>
				</li>
				<li className="mb-5">
					Obtain XBC by mining, or ask the creator himself for some coins.
					<Link
						to="mine"
						className="button is-small is-info is-pulled-right has-text-weight-semibold px-4"
					>
						<span className="material-icons-outlined md-28">arrow_right_alt</span>
					</Link>
				</li>
				<li className="mb-5">
					Check your wallet for balance so you don't go broke!
					<Link
						to="wallet"
						className="button is-small is-info is-pulled-right has-text-weight-semibold px-4"
					>
						<span className="material-icons-outlined md-28">arrow_right_alt</span>
					</Link>
				</li>
				<li className="mb-5">
					Make global transactions to anyone
					<Link
						to="new-transaction"
						className="button is-small is-info is-pulled-right has-text-weight-semibold px-4"
					>
						<span className="material-icons-outlined md-28">arrow_right_alt</span>
					</Link>
				</li>
				<li className="mb-5">
					Host your own node with a copy of the blockchain, and become a valuable peer in the
					network. (coming soon)
				</li>
			</ol>
		</section>
	);
};

export default LandingPage;
