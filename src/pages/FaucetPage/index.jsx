import { useParams } from "../../hooks/useParams";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";

import Loading from "../../components/Loading";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaSiteKey } from "../../config";
import axios from "axios";

import { numberWithCommas } from "../../helpers";

const FaucetPage = () => {
  const [loading, params] = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [addressInfo, setAddressInfo] = useState({});

  const api = useSelector(state => state.network.api);

  const recaptchaRef = useRef(null);

  const faucetAddress = "8bobLqxCRPTSEhvZwQTeKnKz5429N26";

  function onChange(value) {
    // setCaptchaDone(true);
  }

  const send = e => {
    e.preventDefault();
    const address = e.target.address.value;
    const recaptchaValue = recaptchaRef.current.getValue();
    setErrorMessage("");

    if (!recaptchaValue) {
      setErrorMessage("please do the recaptcha first.");
      return;
    }

    setErrorMessage("not implemented");

    console.log(recaptchaValue);
  };

  const getAddressInfo = async () => {
    const results = await axios.post(`${api}/address/info`, {
      addresses: faucetAddress,
    });
    setAddressInfo(results.data);
  };

  useEffect(() => {
    getAddressInfo();
  }, []);

  if (loading)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  return (
    <main className="section">
      <h1 className="title is-size-4 is-size-2-tablet">Faucet</h1>
      <p className="subtitle is-size-6 is-size-5-tablet">
        Get small amounts of {params.symbol} donated to your address. (WIP)
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
          <ReCAPTCHA ref={recaptchaRef} required sitekey={recaptchaSiteKey} onChange={onChange} />
        </div>

        <p>
          The current rate is <strong>100 {params.symbol}</strong> per request.
        </p>
        <p className="mb-4">
          Once a request is sent, your address will not be able to request again for another <strong>24 hours</strong>.
        </p>

        <div className="is-flex is-flex-wrap-wrap is-align-items-center" style={{ gap: "1.5em" }}>
          <button type="submit" className="button is-info">
            Give me 100 {params.symbol}
          </button>

          {errorMessage && <p className="has-text-danger is-size-6">*{errorMessage}</p>}
        </div>
      </form>

      <hr className="has-background-grey-light" />

      <p>
        Free Bobcoins are currently supplied from this address:{" "}
        <span className="has-text-weight-semibold">{faucetAddress}</span>{" "}
      </p>

      <h4>
        Amount left:{" "}
        <span className="has-text-weight-semibold">
          {numberWithCommas((addressInfo.balance / params.coin).toFixed(8))} {params.symbol}
        </span>
      </h4>

      <p>Consider donating to the address to keep the faucet running.</p>
    </main>
  );
};

export default FaucetPage;
