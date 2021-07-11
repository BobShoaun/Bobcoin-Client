import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useParams } from "../../hooks/useParams";
import { copyToClipboard } from "../../helpers";

import QRCode from "qrcode";

const ReceivePage = () => {
	const [status, params] = useParams();

	const { address } = useSelector(state => state.wallet.keys);

	const [addQR, setAddQR] = useState("");

	const generateQRCode = async () => {
		try {
			setAddQR(await QRCode.toString(address));
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		generateQRCode();
	}, [address]);

	return (
		<main className="section">
			<h1 className="title is-size-4 is-size-2-tablet">Receive</h1>
			<p className="subtitle is-size-6 is-size-5-tablet">
				Share your address below to receive payments.
			</p>

			<section className="px-0 py-6 px-6-tablet">
				<div className="box mx-auto mb-6" style={{ width: "250px", height: "250px" }}>
					{addQR ? (
						<div dangerouslySetInnerHTML={{ __html: addQR }}></div>
					) : (
						<div
							className="is-flex has-text-centered"
							style={{ width: "100%", height: "100%", background: "lightgray" }}
						></div>
					)}
				</div>
				<div className="field mx-auto" style={{ maxWidth: "30em" }}>
					<label className="label">{params.name} Address</label>
					<div className="field has-addons mb-0">
						<div className="control is-expanded">
							<input className="input" type="text" value={address} readOnly />
						</div>
						<p className="control">
							<button className="button" onClick={() => copyToClipboard(address)}>
								<i className="material-icons md-18">content_copy</i>
							</button>
						</p>
					</div>
					<p className="help">This is used as an address to send and receive {params.symbol}.</p>
				</div>
			</section>
		</main>
	);
};

export default ReceivePage;
