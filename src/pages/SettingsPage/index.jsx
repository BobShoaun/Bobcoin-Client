import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNetwork, setMiningPopup as _setMiningPopup } from "../../store/networkSlice";
import { nodes } from "../../config";
import { getNodeIcon } from "../../helpers";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { nodeName: _nodeName, nodeUrl: _nodeUrl, showMiningPopup } = useSelector(state => state.network);

  const [nodeName, setNodeName] = useState(_nodeName);
  const [nodeUrl, setNodeUrl] = useState(_nodeUrl);
  const [miningPopup, setMiningPopup] = useState(showMiningPopup);

  const hasChanges = nodeName !== _nodeName || nodeUrl !== _nodeUrl || miningPopup !== showMiningPopup;

  useEffect(() => {
    if (nodeName === "other") {
      setNodeUrl(_nodeName === "other" ? _nodeUrl : "");
      return;
    }
    const node = nodes.find(node => node.name === nodeName);
    setNodeUrl(node.url);
  }, [nodeName]);

  const confirmSettings = e => {
    e.preventDefault();
    dispatch(_setMiningPopup(miningPopup));
    dispatch(setNetwork({ nodeName, nodeUrl }));
  };

  return (
    <section className="section">
      <h1 className="title is-size-4 is-size-2-tablet">Settings</h1>
      <p className="subtitle is-size-6 is-size-5-tablet">Change your network and client settings.</p>
      <hr />

      <form onSubmit={confirmSettings} action="">
        <h2 className="title is-5 is-spaced mb-2">Network</h2>

        <div className="is-flex is-flex-wrap-wrap mb-6" style={{ gap: ".5em" }}>
          <div className="control has-icons-left">
            <div className="select">
              <select value={nodeName} onChange={({ target }) => setNodeName(target.value)} required>
                <option value="mainnet-alpha">Mainnet Alpha</option>
                <option value="testnet-alpha">Testnet Alpha</option>
                <option value="mainnet-local">Mainnet Local</option>
                <option value="testnet-local">Testnet Local</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="icon is-left">
              <span className="material-icons-two-tone has-text-dark fmd-28">{getNodeIcon(nodeName)}</span>
            </div>
          </div>
          <input
            value={nodeUrl}
            onChange={e => setNodeUrl(e.target.value)}
            disabled={nodeName !== "other"}
            required
            type="text"
            className="input"
            placeholder="Bobcoin Node RPC URL"
            style={{ maxWidth: "30em" }}
          />
        </div>

        <h2 className="title is-5 is-spaced mb-2">Mining</h2>
        <label className="checkbox is-flex is-align-items-center mb-6">
          <input type="checkbox" checked={miningPopup} onChange={({ target }) => setMiningPopup(target.checked)} />
          <p className="ml-2">Show mining success pop up</p>
        </label>

        <div className="is-flex is-align-items-center" style={{ gap: ".75em" }}>
          <button type="submit" className="button is-info" disabled={!hasChanges}>
            Update
          </button>

          {hasChanges && <p className="subtitle is-7 fhas-text-success">Changes not saved</p>}
        </div>
      </form>
    </section>
  );
};

export default SettingsPage;
