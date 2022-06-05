import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";

import Loading from "../../components/Loading";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaSiteKey } from "../../config";
import axios from "axios";

import { numberWithCommas } from "../../helpers";

const FaucetPage = () => {
  const { params, paramsLoaded } = useSelector(state => state.consensus);
  const [errorMessage, setErrorMessage] = useState("");
  const [faucetInfo, setFaucetInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const recaptchaRef = useRef(null);

  const getFaucetInfo = async () => {
    setFaucetInfo(null);
    const { data } = await axios.get(`/faucet/info`);
    setFaucetInfo(data);
  };

  useEffect(getFaucetInfo, []);

  const send = async e => {
    e.preventDefault();

    const address = e.target.address.value;
    const recaptchaResponse = recaptchaRef.current.getValue();

    setErrorMessage("");
    if (!recaptchaResponse) {
      setErrorMessage("Please do the recaptcha first.");
      return;
    }

    try {
      await axios.post(`/faucet/request`, { address, recaptchaResponse });
      setModalOpen(true);
    } catch (e) {
      setErrorMessage(e.response.data);
    }
    recaptchaRef.current.reset();
  };

  if (!paramsLoaded || !faucetInfo)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  return (
    <main className="section">
      <h1 className="title is-size-4 is-size-2-tablet">Faucet</h1>
      <p className="subtitle is-size-6 is-size-5-tablet">
        Get small amounts of {params.symbol} donated to your address.
      </p>

      <form action="" onSubmit={send} className="mb-6">
        <label className="label" htmlFor="address">
          Your Bobcoin Address
        </label>
        <input
          id="address"
          name="address"
          className="input mb-5"
          type="text"
          placeholder="Enter Address"
          required
        ></input>

        <div className="mb-5">
          <ReCAPTCHA ref={recaptchaRef} required sitekey={recaptchaSiteKey} />
        </div>

        <p>
          The current rate is{" "}
          <strong>
            {faucetInfo.donationAmount / params.coin} {params.symbol}
          </strong>{" "}
          per request.
        </p>
        <p className="mb-4">
          Once a request is sent, your address will not be able to request again for another{" "}
          <strong>{faucetInfo.cooldown} hours</strong>.
        </p>

        <div className="is-flex is-flex-wrap-wrap is-align-items-center" style={{ gap: "1.5em" }}>
          <button type="submit" className="button is-info">
            Give me {faucetInfo.donationAmount / params.coin} {params.symbol}
          </button>

          {errorMessage && <p className="has-text-danger is-size-6">*{errorMessage}</p>}
        </div>
      </form>

      <hr className="has-background-grey-light" />

      <p>
        Free Bobcoins are currently supplied from this address:{" "}
        <span className="has-text-weight-semibold">{faucetInfo.address}</span>{" "}
      </p>

      <h4>
        Amount left:{" "}
        <span className="has-text-weight-semibold">
          {numberWithCommas((faucetInfo.balance / params.coin).toFixed(8))} {params.symbol}
        </span>
      </h4>

      <p>Consider donating to the address to keep the faucet running.</p>

      <div className={`modal ${modalOpen ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <section className="modal-card-body p-6-tablet" style={{ borderRadius: "1em" }}>
            <div className="mb-5 is-flex is-align-items-center is-justify-content-center">
              <i className="material-icons-two-tone md-36 mr-3 has-text-black">savings</i>
              <h3 className="title is-3">Bobcoins donated</h3>
            </div>

            <img
              style={{ width: "80%", display: "block" }}
              className="mx-auto"
              src="https://image.freepik.com/free-vector/volunteers-packing-donation-boxes_74855-5299.jpg"
              alt="transaction"
            />

            <p className="subtitle is-5 has-text-centered is-spaced mb-5">
              <strong>
                {faucetInfo.donationAmount / params.coin} {params.symbol}
              </strong>{" "}
              has been donated to your address. Please wait for it to be verified and mined.
            </p>

            <p className="help has-text-centered mb-4">
              *It is not guaranteed when the funds will be transferred, you can mine the transaction yourself to speed
              things up.
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

export default FaucetPage;
