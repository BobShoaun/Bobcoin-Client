import React from "react";
import { Link } from "react-router-dom";

import "./index.css";

const LandingPage = () => {
	return (
		<section className="section">
			<div className="has-text-centered" style={{ margin: "6em" }}>
				<h1 className="title is-1">Welcome to Bobcoin</h1>
				<p className="subtitle is-4">
					an open source, decentralized, peer to peer, blockchain cryptocurrency.
				</p>
				<Link to="overview" className="button is-warning">
					Explore Bobcoin
				</Link>
			</div>
			<img
				className="is-block"
				style={{ width: "70em", height: "24em", objectFit: "cover", margin: "4em auto" }}
				src="images/rocket.jpg"
				alt="rocket"
			/>
			<div className="-has-background-primary has-text-centered" style={{ margin: "8em" }}>
				<h3 className="subtitle is-4 -has-text-white mb-6">
					Bobcoin boast many properties that makes it safe and sustainable:
				</h3>
				<div className="is-flex is-justify-content-center mb-6">
					<div className="-has-background-info has-text-white mr-6">
						<span className="material-icons-outlined md-48 has-text-primary">south</span>
						<h2 className="title is-4 is-spaced mb-2">Low fees</h2>
						<p className="subtitle is-6">Send money globally at the cost of peanuts</p>
					</div>

					<div className="-has-background-info has-text-white mr-6">
						<span class="material-icons-outlined md-48 has-text-primary">emoji_emotions</span>
						<h2 className="title is-4 is-spaced mb-2">Simple</h2>
						<p className="subtitle is-6">Easy to use, all you need is this client</p>
					</div>
					<div className="-has-background-info has-text-white">
						<span class="material-icons-outlined md-48 has-text-primary">terrain</span>
						<h2 className="title is-4 is-spaced mb-2">High Market Cap</h2>
						<p className="subtitle is-6">Up to 118,000,000 XBC available</p>
					</div>
				</div>
				<div className="is-flex is-justify-content-center mb-6">
					<div className="-has-background-info has-text-white mr-6">
						<span class="material-icons-outlined md-48 has-text-primary">trending_up</span>
						<h2 className="title is-4 is-spaced mb-2">Big Rewards</h2>
						<p className="subtitle is-6">Get 4096 XBC for each block mined</p>
					</div>

					<div className="-has-background-info has-text-white">
						<span class="material-icons-outlined md-48 has-text-primary">monetization_on</span>
						<h2 className="title is-4 is-spaced mb-2">Inspired by Bitcoin</h2>
						<p className="subtitle is-6">Implemented following bitcoin's algorithms</p>
					</div>
				</div>
			</div>

			<div className="has-text-centered mb-6">
				<h1 className="title is-3">What are you waiting for?</h1>
				<p className="subtitle is-4">Start investing in Bobcoins</p>
				<hr />
			</div>
			<ol className="mx-auto subtitle is-5" style={{ width: "50em", marginBottom: "5em" }}>
				<li className="mb-5">
					Generate a private key and address
					<button className="button is-small is-primary is-pulled-right has-text-weight-semibold">
						Go<span class="material-icons-outlined md-18 ml-2">arrow_forward</span>
					</button>
				</li>
				<li className="mb-5">
					Obtain XBC by mining, or ASK the creator himself for some coins.
					<button className="button is-small is-primary is-pulled-right has-text-weight-semibold">
						Go<span class="material-icons-outlined md-18 ml-2">arrow_forward</span>
					</button>
				</li>
				<li className="mb-5">
					Check your wallet for balance so you don't go broke!
					<button className="button is-small is-primary is-pulled-right has-text-weight-semibold">
						Go<span class="material-icons-outlined md-18 ml-2">arrow_forward</span>
					</button>
				</li>
				<li className="mb-5">
					Make global transactions to anyone
					<button className="button is-small is-primary is-pulled-right has-text-weight-semibold">
						Go<span class="material-icons-outlined md-18 ml-2">arrow_forward</span>
					</button>
				</li>
				<li className="mb-5">Rinse and repeat, and become a valuable peer in the network.</li>
			</ol>
		</section>
	);
};

export default LandingPage;
