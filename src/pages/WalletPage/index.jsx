import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Loading from "../../components/Loading";
import Onboarding from "./Onboarding";
import "./index.css";

import SummaryTab from "./SummaryTab";
import MoreTab from "./MoreTab";
import ReceiveTab from "./ReceiveTab";
import SendTab from "./SendTab";

import { WalletContext } from "./WalletContext";
import axios from "axios";

const WalletPage = () => {
  const { mnemonic, externalKeys, internalKeys, xprv } = useSelector(state => state.wallet);
  const { params, paramsLoaded } = useSelector(state => state.consensus);

  const [walletInfo, setWalletInfo] = useState(null);
  const [tab, setTab] = useState("summary");

  const getWalletInfo = async () => {
    const addresses = [...externalKeys, ...internalKeys].map(key => key.addr);
    if (!addresses.length) return;
    const results = await axios.post(`/address/info`, addresses);
    setWalletInfo(results.data);
  };

  useEffect(getWalletInfo, [externalKeys, internalKeys]);

  if (!mnemonic) return <Onboarding />;

  const loading = !walletInfo || !paramsLoaded;
  if (loading)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  return (
    <WalletContext.Provider value={{ walletInfo, params, externalKeys, internalKeys, xprv }}>
      <main className="section">
        <h1 className="title is-size-4 is-size-2-tablet">Wallet</h1>
        <p className="subtitle is-size-6 is-size-5-tablet">Your wallet containing all the keys to your coins.</p>
        <div className="tabs is-toggle is-fullwidth mb-6">
          <ul>
            <li onClick={() => setTab("summary")} className={tab === "summary" ? "is-active" : ""}>
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
            <li onClick={() => setTab("receive")} className={tab === "receive" ? "is-active" : ""}>
              <a>
                <div className="material-icons-outlined md-18 mr-2">call_received</div>
                <span>Receive</span>
              </a>
            </li>
            <li onClick={() => setTab("more")} className={tab === "more" ? "is-active" : ""}>
              <a>
                <div className="material-icons-outlined md-18 mr-2">info</div>
                <span>Info</span>
              </a>
            </li>
          </ul>
        </div>

        {tab === "summary" && <SummaryTab />}
        {tab === "send" && <SendTab />}
        {tab === "receive" && <ReceiveTab />}
        {tab === "more" && <MoreTab />}
      </main>
    </WalletContext.Provider>
  );
};

export default WalletPage;
