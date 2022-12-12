import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import Loading from "../../components/Loading";
import { deriveKeys, isMnemonicValid, getHdKeys } from "blockcrypto";
import { setHdKeys as setHdWalletKeys, addExternalKeys, addInternalKeys } from "../../store/walletSlice";

import axios from "axios";

const WalletImportPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { params, paramsLoaded } = useSelector(state => state.consensus);
  const wordListSelect = useRef(null);
  const [mnemonic, setMnemonic] = useState("");

  const scanAddresses = async (hdKeys, startIndex, isInternal) => {
    const discoveryGapLimit = 20;
    const keys = [];
    for (let i = startIndex; i < startIndex + discoveryGapLimit; i++) {
      const _keys = deriveKeys(params, hdKeys.xprv, 0, isInternal ? 1 : 0, i);
      _keys.index = i;
      keys.push(_keys);
    }
    const results = await axios.post(
      "/wallet/used",
      keys.map(key => key.address)
    );

    // get last used address index
    let upper = 0;
    for (let i = discoveryGapLimit - 1; i >= 0; i--) {
      if (results.data[i].used) {
        upper = i + 1;
        break;
      }
    }

    // add keys until last used address index
    for (let i = 0; i < upper; i++) {
      dispatch((isInternal ? addInternalKeys : addExternalKeys)(keys[i]));
    }

    if (upper > 0) await scanAddresses(hdKeys, startIndex + upper, isInternal);
  };

  const importWallet = async () => {
    const wordList = wordListSelect.current.value;
    if (wordList === "none") {
      console.error("wordlist not selected!");
      alert("Please select a word list");
      return;
    }
    if (!isMnemonicValid(mnemonic, wordList)) {
      console.error("invalid mnemonic");
      alert("invalid mnemonic for word list");
      return;
    }
    const hdKeys = await getHdKeys(mnemonic, "");
    dispatch(setHdWalletKeys({ mnemonic, xprv: hdKeys.xprv, xpub: hdKeys.xpub }));

    // setup external keys
    const { secretKey, publicKey, address } = deriveKeys(params, hdKeys.xprv, 0, 0, 0);
    dispatch(addExternalKeys({ secretKey, publicKey, address, index: 0 }));
    await scanAddresses(hdKeys, 1, false);

    // setup internal keys
    await scanAddresses(hdKeys, 0, true);

    history.push("/wallet");
  };

  if (!params) return <Loading />;

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
