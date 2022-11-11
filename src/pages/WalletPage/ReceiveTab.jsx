import { useState, useEffect, useMemo, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import { copyToClipboard } from "../../helpers";

import { deriveKeys } from "blockcrypto";
import { addExternalKeys } from "../../store/walletSlice";
import { WalletContext } from ".";

import QRCode from "qrcode";
import axios from "axios";

const ReceiveTab = () => {
  const dispatch = useDispatch();
  const { xprv, externalKeys } = useSelector(state => state.wallet);
  const { walletInfo, params } = useContext(WalletContext);

  const [addressQR, setAddressQR] = useState("");
  const [addressIndex, setAddressIndex] = useState(externalKeys.length - 1);
  const [addressUsage, setAddressUsage] = useState([]);

  const generateQRCode = async () => {
    try {
      setAddressQR(await QRCode.toString(address));
    } catch (e) {
      console.error(e);
    }
  };

  const generateNewAddress = () => {
    const index = externalKeys.length;
    const { secretKey, publicKey, address } = deriveKeys(params, xprv, 0, 0, index);
    dispatch(addExternalKeys({ secretKey, publicKey, address, index }));
    setAddressIndex(index);
  };

  const getAddressUsage = async () => {
    const results = await axios.post(
      "/wallet/used",
      externalKeys.map(key => key.address)
    );
    setAddressUsage(results.data.map(a => a.used));
  };

  const address = useMemo(() => externalKeys[addressIndex]?.address ?? "", [externalKeys, addressIndex]);

  useEffect(generateQRCode, [address]);
  useEffect(getAddressUsage, [externalKeys]);

  return (
    <main>
      <p className="subtitle is-size-6 is-size-5-tablet">Share your address below to receive payments.</p>

      <section className="px-0 px-4-tablet">
        <div className="field mx-auto mb-6" style={{ maxWidth: "30em" }}>
          <label className="label">Your {params.name} Address</label>
          <div className="field has-addons mb-0">
            <div className="control is-expanded">
              <input className="input" type="text" value={address} readOnly />
            </div>
            <p className="control">
              <button className="button" onClick={() => copyToClipboard(address, "Address copied")}>
                <i className="material-icons md-18">content_copy</i>
              </button>
            </p>
          </div>
        </div>

        <div className="box mx-auto mb-6" style={{ width: "250px", height: "250px" }}>
          {addressQR ? (
            <div dangerouslySetInnerHTML={{ __html: addressQR }}></div>
          ) : (
            <div
              className="is-flex has-text-centered"
              style={{ width: "100%", height: "100%", background: "lightgray" }}
            ></div>
          )}
        </div>

        <div className="card mx-auto" style={{ maxWidth: "50em" }}>
          <div className="card-content">
            <button onClick={generateNewAddress} className="button is-info is-light mb-4 mx-auto is-block">
              Generate new address
            </button>
            <div style={{ overflowY: "auto" }}>
              <table className="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th>Your addresses</th>
                    <th>Derivation path</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...externalKeys].reverse().map(({ address, index }) => (
                    <tr
                      onClick={() => setAddressIndex(index)}
                      className={`is-clickable ${index === addressIndex ? "is-selected" : ""}`}
                      key={index}
                    >
                      <td>
                        <a
                          href={`/address/${address}`}
                          title="View in block explorer"
                          className="material-icons md-14 ml-2"
                          onClick={() => copyToClipboard(address, "Address copied")}
                        >
                          open_in_new
                        </a>
                      </td>
                      <td>
                        <i
                          title="copy address to clipboard"
                          className="material-icons md-14"
                          onClick={() => copyToClipboard(address, "Address copied")}
                        >
                          content_copy
                        </i>
                      </td>
                      <td>
                        <p>{address}</p>
                      </td>
                      <td>{`m/${params.derivPurpose}'/${params.derivCoinType}'/0'/0/${index}`}</td>
                      <td>{addressUsage[index] ? "Used" : "Unused"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReceiveTab;
