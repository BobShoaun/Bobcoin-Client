import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { useParams } from "../../hooks/useParams";

import Loading from "../../components/Loading";
import { deriveKeys, validateMnemonic, getHdKey } from "blockcrypto";
import { setHdKeys as setHdWalletKeys, addExternalKeys } from "../../store/walletSlice";

const WalletImportPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, params] = useParams();
  const wordListSelect = useRef(null);
  const [mnemonic, setMnemonic] = useState("");

  const importWallet = async () => {
    const wordList = wordListSelect.current.value;
    if (wordList === "none") {
      console.error("wordlist not selected!");
      return;
    }
    if (!validateMnemonic(mnemonic, wordList)) {
      console.error("invalid mnemonic");
      return;
    }
    const hdKeys = await getHdKey(mnemonic, "");
    const { sk, pk, addr } = deriveKeys(params, hdKeys.xprv, 0, 0, 0); // TODO: scan for addresses with balance.
    dispatch(setHdWalletKeys({ mnemonic, xprv: hdKeys.xprv, xpub: hdKeys.xpub }));
    dispatch(addExternalKeys({ sk, pk, addr, index: 0 }));
    history.push("./");
  };

  if (loading)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  return (
    <main className="section">
      <h1 className="title is-size-4 is-size-2-tablet">Import Wallet</h1>
      <p className="subtitle is-size-6 is-size-5-tablet mb-4">Import an existing wallet from your seed phrase.</p>
      <hr className="-has-background-grey mt-0 mb-6" />
      <section className="-is-flex" style={{ gap: "2em" }}>
        <div className="field mb-5">
          <label className="label">Word List</label>
          <div className="control">
            <div className="select">
              <select ref={wordListSelect} required defaultValue="none">
                <option hidden disabled value="none">
                  -- select a language --
                </option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="chinese_simplified">Chinese (Simplified)</option>
                <option value="chinese_traditional">Chinese (Traditional)</option>
                <option value="italian">Italian</option>
                <option value="japanese">Japanese</option>
                <option value="korean">Korean</option>
              </select>
            </div>
          </div>
          <p className="help">This is necessary to properly import your wallet.</p>
        </div>
        <div className="field mb-5">
          <label className="label">Secret backup phrase</label>
          <div className="control">
            <textarea
              className="textarea is-info has-fixed-size"
              placeholder="Please enter your 12 word mnemonic phrase seperated by spaces"
              onChange={e => setMnemonic(e.target.value)}
            ></textarea>
          </div>
          {/* <p className="help">Make sure you are not being watched! Unless you trust the person.</p> */}
        </div>

        <div className="field is-grouped">
          <div onClick={() => history.goBack()} className="control ml-auto">
            <button className="button">Cancel</button>
          </div>
          <div className="control">
            <button onClick={importWallet} className="button is-primary">
              Import
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WalletImportPage;
