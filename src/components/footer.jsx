import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
	const params = useSelector(state => state.blockchain.params);

	return (
		<footer className="footer">
			<div className="content has-text-centered">
				<p>This client broadcasts information to peers through a centralized node.</p>
				<p>
					<strong>{params.name}</strong> by <a href="https://bobng.me">Ng Bob Shoaun</a>.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
