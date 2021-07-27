import React from "react";
import { useSelector } from "react-redux";
import { copyToClipboard } from "../helpers";

const Footer = () => {
	const params = useSelector(state => state.consensus.params);

	const address = "8bobLqxCRPTSEhvZwQTeKnKz5429N26";

	return (
		<footer className="footer">
			<div className="content has-text-centered">
				<p className="is-size-7 is-size-6-tablet">
					Like this project? Consider donating to {address}.
					<span
						onClick={() => copyToClipboard(address, "Address copied")}
						className="material-icons-outlined md-14 my-auto ml-1 is-clickable"
					>
						content_copy
					</span>
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
