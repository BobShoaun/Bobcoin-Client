import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "./index.css";

const LandingPage = () => {
  const { params, paramsLoaded } = useSelector(state => state.consensus);

  return (
    <main className="section">
      <div className="has-text-centered mb-7 mt-6">
        <h1 className="title is-size-2 is-size-1-tablet is-spaced mb-4">Welcome to {params.name ?? "Bobcoin"}</h1>
        <h2 className="subtitle is-size-5 is-size-4-tablet is-spaced mb-6 mx-auto" style={{ maxWidth: "35em" }}>
          An open source, decentralized, peer to peer, proof of work, permissionless, blockchain digital currency that
          will take us to Mars.
        </h2>

        <div className="dropdown is-hoverable mr-2">
          <div className="dropdown-trigger">
            <button className="button has-text-weight-semibold" aria-haspopup="true" aria-controls="dropdown-menu4">
              <span className="material-icons-outlined mr-2">code</span>
              Source
            </button>
          </div>
          <div
            className="dropdown-menu"
            id="dropdown-menu4"
            role="menu"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            <div className="dropdown-content has-text-weight-semibold">
              <a
                href="https://github.com/BobShoaun/Bobcoin-Node"
                target="_blank"
                className="dropdown-item is-flex is-align-items-center is-justify-content-center"
                style={{ paddingInline: 0, gap: ".5em" }}
              >
                <span className="material-icons-two-tone is-size-6">api</span>
                Bobcoin-Node
              </a>
              <a
                href="https://github.com/BobShoaun/Bobcoin-Client"
                target="_blank"
                className="dropdown-item is-flex is-align-items-center is-justify-content-center"
                style={{ paddingInline: 0, gap: ".5em" }}
              >
                <span className="material-icons-two-tone is-size-6">terminal</span>
                Bobcoin-Client
              </a>
              <a
                href="https://github.com/BobShoaun/Blockchain-Crypto"
                target="_blank"
                className="dropdown-item is-flex is-align-items-center is-justify-content-center"
                style={{ paddingInline: 0, gap: ".5em" }}
              >
                <span className="material-icons-two-tone is-size-6">inventory_2</span>
                Blockcrypto
              </a>
            </div>
          </div>
        </div>

        {/* <a
          href="https://github.com/BobShoaun/Bobcoin-Node"
          target="_blank"
          className="button mr-3 has-text-weight-semibold"
        >
          <span className="material-icons-outlined mr-2">code</span>
          Source
        </a> */}
        <Link to="overview" className="button is-primary has-text-weight-semibold">
          <span className="material-icons-outlined mr-2">explore</span>
          Explore
        </Link>
      </div>
      <img className="rocket" src="images/rocket.jpg" alt="rocket" />
      <div className="-has-background-primary has-text-centered" style={{ margin: "5em 0 10em 0" }}>
        <h3 className="title is-size-5 is-size-4-tablet mb-2">
          Bobcoin is safe, secure, sustainable, and simply great:
        </h3>
        <p style={{ marginBottom: "4em", fontSize: "1.15rem" }} className="has-text-centered">
          Read more about the thought process behind this project{" "}
          <a
            href="https://www.bobng.me/articles/how-i-made-my-own-cryptocurrency"
            target="_blank"
            style={{ textDecoration: "underline" }}
          >
            here
          </a>
          .
        </p>

        <div className="qualities-grid mx-7-tablet">
          <div className="-has-background-info has-text-white">
            <span className="material-icons-two-tone md-48 has-text-info">local_atm</span>
            <h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">Low fees</h2>
            <p className="subtitle is-6">Transact globally by paying what you want, or pay nothing!</p>
          </div>

          <div className="-has-background-info has-text-white">
            <span className="material-icons-two-tone md-48 has-text-info">emoji_emotions</span>
            <h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">Simple</h2>
            <p className="subtitle is-6">Easy to use, all you need is this lightweight, browser client</p>
          </div>
          <div className="-has-background-info has-text-white">
            <span className="material-icons-two-tone md-48 has-text-info">terrain</span>
            <h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">Deflationary</h2>
            <p className="subtitle is-6">
              Total circulating supply will eventually be capped at {(params.hardCap / params.coin).toLocaleString()}{" "}
              {params.symbol}
            </p>
          </div>
          <div className="-has-background-info has-text-white">
            <span className="material-icons-two-tone md-48 has-text-info">emoji_events</span>
            <h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">Big Rewards</h2>
            <p className="subtitle is-6">
              Get {params.initBlkReward / params.coin} {params.symbol} minted straight to your address with each block
              mined
            </p>
          </div>
          <div className="-has-background-info has-text-white">
            <span className="material-icons-two-tone md-48 has-text-info">enhanced_encryption</span>
            <h2 className="title is-size-5 is-size-4-tablet is-spaced mb-2">Secure</h2>
            <p className="subtitle is-6">Based heavily on the nakamoto consensus and bitcoin protocol.</p>
          </div>
        </div>
      </div>

      <div className="has-text-centered mb-6">
        <h1 className="title is-size-5 is-size-4-tablet mb-2">What are you waiting for?</h1>
        <p className="" style={{ fontSize: "1.15rem" }}>
          Get started by investing and hodling {params.name}
        </p>
        <hr className="has-background-grey-light" />
      </div>
      <ol className="pl-3 px-6-tablet has-text-grey-dark" style={{ marginBottom: "5em", fontSize: "1.15rem" }}>
        <li className="mb-5">
          <div className="is-flex">
            <p>Create or import a Bobcoin wallet.</p>
            <Link to="wallet" className="button is-small is-link ml-auto has-text-weight-semibold px-4">
              <span className="material-icons-outlined md-28">arrow_right_alt</span>
            </Link>
          </div>
        </li>
        <li className="mb-5">
          <div className="is-flex">
            <p className="">Obtain XBC by mining, from the faucet, or ask the creator himself for some.</p>
            <Link to="mine" className="button is-small is-link ml-auto has-text-weight-semibold px-4">
              <span className="material-icons-outlined md-28">arrow_right_alt</span>
            </Link>
          </div>
        </li>
        <li className="mb-5">
          <div className="is-flex">
            <p>Check your wallet for your balance so you don't go broke!</p>
            <Link to="wallet" className="button is-small is-link ml-auto has-text-weight-semibold px-4">
              <span className="material-icons-outlined md-28">arrow_right_alt</span>
            </Link>
          </div>
        </li>
        <li className="mb-5">
          <div className="is-flex">
            <p>Make transactions to anyone around the world.</p>
            <Link to="wallet" className="button is-small is-link ml-auto has-text-weight-semibold px-4">
              <span className="material-icons-outlined md-28">arrow_right_alt</span>
            </Link>
          </div>
        </li>
        <li className="mb-5">
          <div className="is-flex">
            <p>
              Host a full node that synchronizes the blockchain, become a valuable peer in the network. (coming soon)
            </p>
          </div>
        </li>
      </ol>
    </main>
  );
};

export default LandingPage;
