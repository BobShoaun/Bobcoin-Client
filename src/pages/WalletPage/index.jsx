import React, { useState } from "react";
import { useSelector } from "react-redux";

import Onboarding from "./Onboarding";
import "./index.css";

import SummaryTab from "./SummaryTab";
import MoreTab from "./MoreTab";
import ReceiveTab from "./ReceiveTab";
import SendTab from "./SendTab";

const WalletPage = () => {
	const mnemonic = useSelector(state => state.wallet.mnemonic);

	const [tab, setTab] = useState("summary");

	return (
		<main className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Wallet</h1>
			<p className="subtitle is-size-6 is-size-5-tablet">
				Your wallet containing all the keys to your coins.
			</p>
			{!mnemonic ? (
				<>
					<div className="tabs is-toggle is-fullwidth">
						<ul>
							<li
								onClick={() => setTab("summary")}
								className={tab === "summary" ? "is-active" : ""}
							>
								<a>
									<div className="material-icons-two-tone mr-2">bar_chart</div>
									<span>Summary</span>
								</a>
							</li>
							<li onClick={() => setTab("send")} className={tab === "send" ? "is-active" : ""}>
								<a>
									<div className="material-icons-outlined md-18 mr-2">send</div>
									<span>Send</span>
								</a>
							</li>
							<li
								onClick={() => setTab("receive")}
								className={tab === "receive" ? "is-active" : ""}
							>
								<a>
									<div className="material-icons-outlined md-18 mr-2">call_received</div>
									<span>Receive</span>
								</a>
							</li>
							<li onClick={() => setTab("more")} className={tab === "more" ? "is-active" : ""}>
								<a>
									<div className="material-icons-outlined md-18 mr-2">info</div>
									<span>More</span>
								</a>
							</li>
						</ul>
					</div>

					{tab === "summary" && <SummaryTab />}
					{tab === "send" && <SendTab />}
					{tab === "receive" && <ReceiveTab />}
					{tab === "more" && <MoreTab />}
				</>
			) : (
				<Onboarding></Onboarding>
			)}
		</main>
	);
};

export default WalletPage;
