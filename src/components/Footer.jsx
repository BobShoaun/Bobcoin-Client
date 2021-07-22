import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
	const params = useSelector(state => state.consensus.params);

	return (
		<footer className="footer">
			<div className="content has-text-centered">
				<p className="is-size-7 is-size-6-tablet">
					Like this project? Consider donating to 8bobLqxCRPTSEhvZwQTeKnKz5429N26.
				</p>
				<p className="is-size-7 is-size-6-tablet">
					<strong>{params.name}</strong> by{" "}
					<a target="_blank" href="https://bobng.me">
						Ng Bob Shoaun
					</a>
					.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
