import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { copyToClipboard } from "../../helpers";

import QRCode from "qrcode";

const ReceivePage = () => {
  const { params } = useSelector(state => state.consensus);

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
      <p className="subtitle is-size-6 is-size-5-tablet">Share your address below to receive payments.</p>

      <section className="px-0 py-6 px-6-tablet">
        <div className="field mx-auto mb-6" style={{ maxWidth: "30em" }}>
          <label className="label">Your {params.name} Address</label>
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
        </div>

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

        <div className="card mx-auto" style={{ width: "40em" }}>
          <div className="card-content has-text-centered">
            <button className="button is-info is-light">Generate new address</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReceivePage;
