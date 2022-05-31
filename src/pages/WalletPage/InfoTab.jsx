import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import { WalletContext } from ".";
import { deleteWallet } from "../../store/walletSlice";

// import "./index.css";

const InfoTab = () => {
  const dispatch = useDispatch();
  const { xprv, xpub, mnemonic, externalKeys, internalKeys } = useSelector(state => state.wallet);
  const { params } = useContext(WalletContext);

  const onDeleteWallet = () => {
    if (
      !window.confirm(
        "This action will delete all traces of your wallet from your local storage, you can still reimport your wallet with your 12-word mnemonic phrase."
      )
    )
      return;
    dispatch(deleteWallet());
  };

  return (
    <main>
      <h2 className="title is-5">General information</h2>
      <p className="subtitle is-6 mb-3">Information used to construct all children addresses.</p>

      <div className="card mb-6">
        <div className="card-content">
          <table className="table is-fullwidth is-block mb-1" style={{ overflowY: "auto" }}>
            <tbody>
              <tr>
                <th className="has-text-weight-semibold">Mnemonic phrase</th>
                <td>{mnemonic}</td>
              </tr>
              <tr>
                <th className="has-text-weight-semibold">Master extended private key</th>
                <td style={{ wordBreak: "break-all" }}>{xprv}</td>
              </tr>
              <tr>
                <th className="has-text-weight-semibold">Master extended public key</th>
                <td style={{ wordBreak: "break-all" }}>{xpub}</td>
              </tr>
              <tr>
                <th className="has-text-weight-semibold">Generated addresses</th>
                <td>{externalKeys.length + internalKeys.length}</td>
              </tr>
              <tr>
                <th className="has-text-weight-semibold">Account Index</th>
                <td>0</td>
              </tr>
            </tbody>
          </table>
          <section className="has-text-right">
            <button onClick={onDeleteWallet} className="button is-danger">
              <span className="material-icons-outlined is-size-5 mr-1">delete</span>
              Delete wallet
            </button>
          </section>
        </div>
      </div>
      <h2 className="title is-5">External Addresses</h2>
      <p className="subtitle is-6 mb-3">Addresses that are explicitly used by the user.</p>
      <div className="card mb-6">
        <div className="card-content">
          <table className="table is-fullwidth is-block" style={{ overflowY: "auto" }}>
            <thead>
              <tr>
                <th>Index</th>
                <th>Address</th>
                <th>Public key</th>
                <th>Private key</th>
                <th>Derivation path</th>
              </tr>
            </thead>
            <tbody>
              {externalKeys.map(({ sk, pk, addr, index }) => (
                <tr key={index}>
                  <td className="has-text-centered">{index}</td>
                  <td style={{ wordBreak: "break-all" }}>{addr}</td>
                  <td style={{ wordBreak: "break-all" }}>{pk}</td>
                  <td style={{ wordBreak: "break-all" }}>{sk}</td>
                  <td>{`m/${params.derivPurpose}'/${params.derivCoinType}'/0'/0/${index}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="title is-5">Internal Addresses</h2>
      <p className="subtitle is-6 mb-3">
        Addresses not explicitly used by the user, designated for change outputs in a transaction.
      </p>
      <div className="card mb-6">
        <div className="card-content">
          <table className="table is-fullwidth is-block" style={{ overflowY: "auto" }}>
            <thead>
              <tr>
                <th>Index</th>
                <th>Address</th>
                <th>Public key</th>
                <th>Private key</th>
                <th>Derivation path</th>
              </tr>
            </thead>
            <tbody>
              {internalKeys.map(({ sk, pk, addr, index }) => (
                <tr key={index}>
                  <td className="has-text-centered">{index}</td>
                  <td style={{ wordBreak: "break-all" }}>{addr}</td>
                  <td style={{ wordBreak: "break-all" }}>{pk}</td>
                  <td style={{ wordBreak: "break-all" }}>{sk}</td>
                  <td>{`m/${params.derivPurpose}'/${params.derivCoinType}'/0'/1/${index}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default InfoTab;
