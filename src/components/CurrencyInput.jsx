import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import "./currencyinput.css";

const CurrencyInput = ({ onChange }) => {
	const params = useSelector(state => state.consensus.params);

	const [amount, setAmount] = useState(0);
	const [cents, setCents] = useState(0);

	useEffect(() => {
		let c = cents.toString();
		c = c.padEnd(8, "0");

		const finalAmount = amount * params.coin + parseInt(c);
		onChange(finalAmount);
	}, [amount, cents]);

	return (
		<div className="is-flex is-align-items-baseline wrapper input">
			<input
				type="number"
				step="none"
				placeholder="0"
				className="main has-text-right subtitle mb-0"
				value={amount === 0 ? "" : amount}
				onChange={({ target }) =>
					setAmount(target.value > params.coin ? Math.trunc(target.value / 10) : target.value)
				}
				style={{ flexGrow: 0, width: "5em" }}
			/>
			<p className="title is-4 mb-0">.</p>
			<input
				type="number"
				step="1000"
				placeholder="00000000"
				className="right subtitle mb-0"
				value={cents === 0 ? "" : cents}
				onChange={({ target }) =>
					setCents(target.value > params.coin ? Math.trunc(target.value / 10) : target.value)
				}
				style={{ flexGrow: 1 }}
			/>
		</div>
	);
};

export default CurrencyInput;
