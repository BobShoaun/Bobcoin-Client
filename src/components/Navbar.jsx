import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "./navbar.css";

const Navbar = () => {
  const network = useSelector(state => state.network.network);
  const keys = useSelector(state => state.wallet.keys);

  return (
    <>
      <nav
        className="navbar is-dark"
        role="navigation"
        aria-label="main navigation"
        style={{ position: "fixed", left: 0, right: 0, top: 0 }}
      >
        <section
          className="has-background-dark has-text-centered is-flex is-justify-content-space-evenly is-hidden-desktop"
          style={{ position: "fixed", zIndex: 100, bottom: 0, width: "100vw" }}
        >
          <div
            tabIndex={0}
            className="has-text-white nav-mobile p-2 explore-button"
            style={{ flexBasis: "20%", position: "relative" }}
          >
            <span className="material-icons-outlined is-white md-28 mb-0" style={{ color: "white" }}>
              explore
            </span>
            <p className="is-size-7">Explore</p>
            <div className="explore-dropdown has-background-dark" role="menu">
              <Link to="/overview" className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center">
                <span className="material-icons-outlined is-white md-20 mr-3">travel_explore</span>
                <p className="is-size-6">Overview</p>
              </Link>
              <Link to="/blockchain" className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center">
                <span className="material-icons-outlined is-white md-20 mr-3">view_in_ar</span>
                <p className="is-size-6">Blockchain</p>
              </Link>
              <Link to="/parameters" className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center">
                <span className="material-icons-outlined is-white md-20 mr-3">gavel</span>
                <p className="is-size-6">Consensus</p>
              </Link>
              <a
                href="https://www.bobng.me/articles/how-i-made-my-own-cryptocurrency"
                target="_blank"
                className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center"
              >
                <span className="material-icons-outlined is-white md-20 mr-3">description</span>
                <p className="is-size-6">Whitepaper</p>
              </a>
            </div>
          </div>

          <div
            tabIndex={0}
            className="has-text-white nav-mobile p-2 explore-button"
            style={{ flexBasis: "20%", position: "relative" }}
          >
            <span className="material-icons-outlined is-white md-28 mb-0" style={{ color: "white" }}>
              trending_up
            </span>
            <p className="is-size-7">Earn</p>
            <div className="explore-dropdown has-background-dark" role="menu">
              <Link to="/mine" className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center">
                <span className="material-icons-outlined is-white md-20 mr-3">engineering</span>
                <p className="is-size-6">Mine</p>
              </Link>
              <Link to="/faucet" className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center">
                <span className="material-icons-outlined is-white md-20 mr-3">water_drop</span>
                <p className="is-size-6">Faucet</p>
              </Link>
            </div>
          </div>

          <Link to={`/wallet`} className="has-text-white nav-mobile p-2" style={{ flexBasis: "20%" }}>
            <span className="material-icons-outlined is-white md-28 mb-0" style={{ color: "white" }}>
              account_balance_wallet
            </span>
            <p className="is-size-7">Wallet</p>
          </Link>

          <div
            tabIndex={0}
            className="has-text-white nav-mobile p-2 explore-button"
            style={{ flexBasis: "20%", position: "relative" }}
          >
            <span className="material-icons-outlined is-white md-28 mb-0" style={{ color: "white" }}>
              support
            </span>
            <p className="is-size-7">Join</p>
            <div className="explore-dropdown has-background-dark" role="menu">
              <Link to="/developer" className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center">
                <span className="material-icons-outlined is-white md-20 mr-3">code</span>
                <p className="is-size-6">API</p>
              </Link>
              <Link to="/node" className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center">
                <span className="material-icons-outlined is-white md-20 mr-3">dns</span>
                <p className="is-size-6">Full node</p>
              </Link>
            </div>
          </div>

          <div
            tabIndex={0}
            className="has-text-white nav-mobile p-2 more-button"
            style={{ flexBasis: "20%", position: "relative" }}
          >
            <span className="material-icons-outlined is-white md-28 mb-0" style={{ color: "white" }}>
              more_horiz
            </span>
            <p className="is-size-7">More</p>
            <div className="more-dropdown has-background-dark" role="menu">
              <p className="subtitle is-7 mb-3 has-text-white">
                Currently connected to the{" "}
                <strong className="has-text-success">{network === "mainnet" ? "MainNet" : "TestNet"}</strong>
              </p>

              <Link to="/settings" className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center">
                <span className="material-icons-outlined is-white md-20 mr-3">settings</span>
                <p className="is-size-6">Settings</p>
              </Link>

              <Link
                to="/transaction/create"
                className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center"
              >
                <span className="material-icons-outlined is-white md-20 mr-3">payment</span>
                <p className="is-size-6">Transaction</p>
              </Link>

              <Link to="/generate-keys" className="has-text-white nav-mobile px-4 py-3 is-flex is-align-items-center">
                <span className="material-icons-outlined is-white md-20 mr-3">key</span>
                <p className="is-size-6">Generate Keys</p>
              </Link>
            </div>
          </div>
        </section>

        <div className="navbar-brand">
          <Link className="navbar-item mr-2" to="/">
            <span className="material-icons-outlined mr-2">monetization_on</span>
            <h1 className="has-text-weight-semibold">Bobcoin (XBC)</h1>
          </Link>
        </div>

        <div className="navbar-menu navbar-start">
          <div className="navbar-item has-dropdown is-hoverable mr-2">
            <div className="navbar-link">Explore</div>
            <div className="navbar-dropdown is-boxed">
              <Link to="/overview" className="navbar-item has-text-weight-semibold">
                <span className="material-icons-two-tone md-18 mr-2">travel_explore</span>
                Overview
              </Link>
              <Link to="/blockchain" className="navbar-item has-text-weight-semibold">
                <span className="material-icons-two-tone md-18 mr-2">account_tree</span>
                Blockchain
              </Link>
              <Link to="/parameters" className="navbar-item has-text-weight-semibold">
                <span className="material-icons-two-tone md-18 mr-2">gavel</span>
                Consensus Rules
              </Link>
              <a
                href="https://www.bobng.me/articles/how-i-made-my-own-cryptocurrency"
                target="_blank"
                className="navbar-item has-text-weight-semibold"
              >
                <span className="material-icons-two-tone md-18 mr-2">description</span>
                Whitepaper
              </a>
            </div>
          </div>

          <div className="navbar-item has-dropdown is-hoverable mr-2">
            <div className="navbar-link">Earn</div>
            <div className="navbar-dropdown is-boxed">
              <Link to="/mine" className="navbar-item has-text-weight-semibold">
                <span className="material-icons-two-tone md-18 mr-2">engineering</span>
                Mine
              </Link>
              <Link to="/faucet" className="navbar-item has-text-weight-semibold">
                <span className="material-icons-two-tone md-18 mr-2">water_drop</span>
                Faucet
              </Link>
            </div>
          </div>

          <div className="navbar-item has-dropdown is-hoverable mr-2">
            <div className="navbar-link">Participate</div>
            <div className="navbar-dropdown is-boxed">
              <Link to="/developer" className="navbar-item has-text-weight-semibold">
                <span className="material-icons-two-tone md-18 mr-2">code</span>
                API
              </Link>
              <Link to="/node" className="navbar-item has-text-weight-semibold">
                <span className="material-icons-two-tone md-18 mr-2">dns</span>
                Run a full node
              </Link>
            </div>
          </div>

          <div className="navbar-item has-dropdown is-hoverable mr-2">
            <div className="navbar-link">More</div>
            <div className="navbar-dropdown is-boxed">
              <Link to="/transaction/create" className="navbar-item has-text-weight-semibold">
                <span className="material-icons-two-tone md-18 mr-2">payment</span>
                Transaction
              </Link>
              <Link to="/generate-keys" className="navbar-item has-text-weight-semibold">
                <span className="material-icons-two-tone md-18 mr-2">key</span>
                Generate Keys
              </Link>
            </div>
          </div>

          <div className="buttons navbar-item ml-auto">
            <Link to={"/wallet"} className="button has-text-weight-bold mr-3">
              <span className="material-icons-two-tone mr-2">account_balance_wallet</span>
              <p>My Wallet</p>
            </Link>

            <div className="dropdown is-right network-button">
              <button
                aria-haspopup="true"
                aria-controls="dropdown-menu6"
                className="dropdown-trigger button is-dark px-2 mx-0"
              >
                <span className="material-icons md-28">{network === "mainnet" ? "language" : "bug_report"}</span>
                <div className="indicator has-background-success"></div>
              </button>
              <div className="dropdown-menu network-dropdown" id="dropdown-menu6" role="menu">
                <div className="dropdown-content fhas-text-right">
                  <div className="dropdown-item">
                    <p>
                      Currently connected to the <strong>{network === "mainnet" ? "MainNet" : "TestNet"}</strong>
                    </p>
                  </div>
                  <hr className="dropdown-divider"></hr>
                  <Link to="/settings" className="dropdown-item is-flex is-align-items-center">
                    <span className="material-icons-outlined mr-2 md-18">settings</span>
                    <p className="">Settings</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
