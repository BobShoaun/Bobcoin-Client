import React from "react";

import Loading from "../../components/Loading";
import "./index.css";

const MoreTab = () => {
	const address = "8UVo1jeAhigidZo3zamQzdjZfqA3YBm";

	const loading = false;

	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	return (
		<main>
			<div className="card mb-5">
				<div className="card-content">
					<h2 className="title is-5 mb-3">Your Addresses</h2>
					<table className="table is-fullwidth">
						<thead>
							<tr>
								<th>Address</th>
								<th>Derivation path</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>fsdfasdfasdfsfasdf</td>
								<td>m/44'/8888'/0'/0/1</td>
							</tr>

							<tr></tr>
						</tbody>
					</table>
				</div>
			</div>
		</main>
	);
};

export default MoreTab;
