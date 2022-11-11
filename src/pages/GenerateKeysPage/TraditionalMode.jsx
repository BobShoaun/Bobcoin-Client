import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { generateKeys, getKeys } from "blockcrypto";
import QRCode from "qrcode";

import { copyToClipboard } from "../../helpers";
import { setKeys as setWalletKeys } from "../../store/walletSlice";

const TraditionalMode = () => {
  const dispatch = useDispatch();
  const params = useSelector(state => state.consensus.params);

  const [keys, setKeys] = useState({ secretKey: "", publicKey: "", address: "" });
  const [secretKeyQR, setSecretKeyQR] = useState("");
  const [addressQR, setAddressQR] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const generateRandom = () => {
    const keys = generateKeys(params);
    setKeys(keys);
    generateQRCode(keys);
  };

  const handleChangeSecretKey = secretKey => {
    if (secretKey === "") {
      setKeys({ secretKey: "", publicKey: "", address: "" });
      setSecretKeyQR(null);
      setAddressQR(null);
      return;
    }
    try {
      const keys = getKeys(params, secretKey);
      setKeys(keys);
      generateQRCode(keys);
    } catch {
      console.log("possibly invalid base58 character");
    }
  };

  const saveKeys = () => {
    dispatch(setWalletKeys(keys));
    setModalOpen(true);
  };

  const generateQRCode = async keys => {
    try {
      setSecretKeyQR(await QRCode.toString(keys.secretKey));
      setAddressQR(await QRCode.toString(keys.address));
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <main>
      <div className="is-flex-tablet mb-6">
        <section className="px-0 py-6 px-6-tablet" style={{ flexBasis: "50%" }}>
          <div className="box mx-auto mb-6" style={{ width: "250px", height: "250px" }}>
            {secretKeyQR ? (
              <div dangerouslySetInnerHTML={{ __html: secretKeyQR }}></div>
            ) : (
              <div
                className="is-flex has-text-centered"
                style={{ width: "100%", height: "100%", background: "lightgray" }}
              >
                <p className="m-auto px-4">Click on "Generate Random Key" below</p>
              </div>
            )}
          </div>

          <div className="field">
            <label className="label">Private / Secret key (base58)</label>
            <div className="field has-addons mb-0">
              <div className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  placeholder="Enter or auto-generate private key"
                  value={keys.secretKey}
                  onChange={({ target }) => handleChangeSecretKey(target.value)}
                ></input>
              </div>
              <p className="control">
                <button className="button" onClick={() => copyToClipboard(keys.secretKey, "Copied!")}>
                  <i className="material-icons md-18">content_copy</i>
                </button>
              </p>
            </div>
            <p className="help is-danger">
              As the name suggest, this key should be kept private and stored in a safe place.
            </p>
          </div>
        </section>

        <section className="px-0 py-6 px-6-tablet" style={{ flexBasis: "50%" }}>
          <div className="box mx-auto mb-6" style={{ width: "250px", height: "250px" }}>
            {addressQR ? (
              <div dangerouslySetInnerHTML={{ __html: addressQR }}></div>
            ) : (
              <div
                className="is-flex has-text-centered"
                style={{ width: "100%", height: "100%", background: "lightgray" }}
              >
                <p className="m-auto px-4">Click on "Generate Random Key" below</p>
              </div>
            )}
          </div>
          <div className="field">
            <label className="label">{params.name} Address</label>
            <div className="field has-addons mb-0">
              <div className="control is-expanded">
                <input className="input" type="text" value={keys.address} readOnly />
              </div>
              <p className="control">
                <button className="button" onClick={() => copyToClipboard(keys.address, "Copied!")}>
                  <i className="material-icons md-18">content_copy</i>
                </button>
              </p>
            </div>
            <p className="help">This is used as an address to send and receive {params.symbol}.</p>
          </div>
        </section>
      </div>
      <div className="has-text-right">
        <button onClick={generateRandom} className="button is-dark has-text-weight-medium mb-3 ml-auto">
          <span className="material-icons-outlined mr-2">shuffle</span>
          Generate random key
        </button>
        <button onClick={saveKeys} className="button is-link has-text-weight-medium ml-3 mb-3">
          <span className="material-icons-outlined mr-2">save</span>
          Save & Use key
        </button>
      </div>

      <div className={`modal ${modalOpen && "is-active"}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <section className="modal-card-body p-6-tablet" style={{ borderRadius: "1em" }}>
            <div className="mb-5 is-flex is-align-items-center is-justify-content-center">
              <i className="material-icons-outlined md-36 mr-3 has-text-black">vpn_key</i>
              <h3 className="title is-3">Your keys are saved</h3>
            </div>

            {/* <img
							style={{ width: "80%", display: "block" }}
							className="mx-auto"
							src="images/key.jpg"
							alt="transaction"
						/> */}

            <p className="subtitle is-5 has-text-centered is-spaced mb-5">
              Your keys are stored locally in the browser for your convenience.
            </p>

            <p className="title is-spaced is-6 mb-2">Private key:</p>
            <pre className="subtitle is-spaced is-6 py-2 mb-4">{keys.secretKey}</pre>

            <p className="title is-spaced is-6 mb-2">Public key:</p>
            <pre className="subtitle is-spaced is-6 py-2 mb-4">{keys.publicKey}</pre>

            <p className="title is-spaced is-6 mb-2">Address:</p>
            <pre className="subtitle is-spaced is-6 py-2 mb-6">{keys.address}</pre>

            <p className="help has-text-centered mb-2">
              *It is your responsiblity to keep your private keys safe, clear your browser's local storage and use an
              offline cold storage for maximum security.
            </p>

            <p className="help has-text-centered mb-4">
              *This way of generating keys is less secure, more cumbersome, and deprecated, use the wallet feature
              instead.
            </p>

            <div className="has-text-centered">
              <button onClick={() => setModalOpen(false)} className="button is-dark has-text-weight-semibold">
                Okay
              </button>
            </div>
          </section>
        </div>
        <button onClick={() => setModalOpen(false)} className="modal-close is-large" aria-label="close"></button>
      </div>
    </main>
  );
};

export default TraditionalMode;
