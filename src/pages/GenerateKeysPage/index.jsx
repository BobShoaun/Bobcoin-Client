import React, { useState } from "react";
import { useSelector } from "react-redux";

import TraditionalMode from "./TraditionalMode";
import HDMode from "./HDMode";

const GenerateKeysPage = () => {
	const params = useSelector(state => state.consensus.params);

	const [mode, setMode] = useState("traditional");

	return (
		<section className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Generate Key</h1>
			<p className="subtitle is-size-6 is-size-5-tablet mb-4">
				A private key and address pair for you to store, send and receive{" "}
				<span style={{ textTransform: "lowercase" }}>{params.name}</span>.
			</p>

			<div class="buttons has-addons is-right">
				<button
					onClick={() => setMode("traditional")}
					className={`button ${mode === "traditional" ? "is-info" : "has-text-grey"}`}
				>
					Traditional / Paper
				</button>
				<button
					onClick={() => setMode("hd")}
					className={`button ${mode === "hd" ? "is-info" : "has-text-grey"}`}
				>
					Hierarchical Deterministic
				</button>
			</div>

			{mode === "traditional" ? <TraditionalMode /> : <HDMode />}
		</section>
	);
};

export default GenerateKeysPage;
