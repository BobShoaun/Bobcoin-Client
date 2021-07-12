import React from "react";
import { useParams } from "../../hooks/useParams";

import Loading from "../../components/Loading";

const NodePage = () => {
	const [loading, params] = useParams();

	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	return (
		<main className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Developer's Guide</h1>
			<p className="subtitle is-size-6 is-size-5-tablet">
				Develop applications that interfaces with {params.name}.
			</p>
			<p className="subtitle is-6">coming soon</p>
		</main>
	);
};

export default NodePage;
