import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { calculateBalance, getHighestValidBlock } from "blockchain-crypto";

const WalletPage = () => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const { publicKey } = useParams();

	return (
		<section className="section">
			<h1 className="title is-2">Wallet</h1>
			<p className="subtitle is-4">See this wallets balance and details.</p>

			<div className="field">
				<label className="label">Public key</label>
				<div className="field has-addons">
					<div className="control is-expanded">
						<input className="input" type="text" placeholder="Input public key"></input>
						{/* <p className="help">The public key of the miner, where to send block reward.</p> */}
					</div>
					<div className="control">
						<Link to={`/wallet/${publicKey}`} className="button is-info">
							Search
						</Link>
					</div>
				</div>
			</div>

			<h2 className="subtitle is-4">Public key: {publicKey || "-"}</h2>
			<p className="subtitle is-5">
				Balance:{" "}
				{parseFloat(calculateBalance(blockchain, getHighestValidBlock(blockchain), publicKey)) ||
					"-"}{" "}
				BBC
			</p>
		</section>
	);
};

export default WalletPage;
