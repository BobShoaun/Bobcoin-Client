import { useHistory } from "react-router";
import "./index.css";

const Onboarding = () => {
  const history = useHistory();

  return (
    <main className="section is-flex-tablet" style={{ fflexWrap: "wrap", gap: "2em" }}>
      <div
        onClick={() => history.push("wallet/import")}
        className="wallet-card card is-clickable mb-5"
        style={{ flex: "1 1 auto" }}
      >
        <div className="card-content p-6-tablet has-text-centered">
          <div className="my-8-tablet">
            <span className="material-icons-two-tone is-block mb-4 wallet-option-icon">file_download</span>
            <h2 className="title is-size-5 is-size-4-tablet is-spaced mb-3">Import Wallet</h2>
            <p className="subtitle is-size-7 is-size-6-tablet mx-6">
              If you already own a wallet and have the secret 12 word mnemonic phrase.
            </p>
          </div>
        </div>
      </div>
      <div
        onClick={() => history.push("wallet/create")}
        className="wallet-card card is-clickable mb-5"
        style={{ flex: "1 1 auto" }}
      >
        <div className="card-content p-6-tablet has-text-centered">
          <div className="my-8-tablet">
            <span className="material-icons-two-tone is-block mb-4 wallet-option-icon">account_balance_wallet</span>
            <h2 className="title is-size-5 is-size-4-tablet is-spaced mb-3">Create a new Wallet</h2>
            <p className="subtitle is-size-7 is-size-6-tablet mx-6">
              Generate a new mnemonic phrase and seed from random numbers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Onboarding;
