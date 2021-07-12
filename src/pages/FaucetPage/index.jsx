import React from "react";
import { useParams } from "../../hooks/useParams";

import Loading from "../../components/Loading";

const FaucetPage = () => {
	const [loading, params] = useParams();

	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	return (
		<main className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Faucet</h1>
			<p className="subtitle is-size-6 is-size-5-tablet">
				Get small amounts of {params.symbol} donated to your address.
			</p>
			<p className="subtitle is-6">coming soon</p>
		</main>
	);
};

export default FaucetPage;
