import { useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import axios from "axios";
import toast from "react-hot-toast";
import {
  deriveKeys,
  createInput,
  createOutput,
  createTransaction,
  signTransaction,
  calculateTransactionHash,
} from "blockcrypto";

import { WalletContext } from ".";
import { addInternalKeys } from "../../store/walletSlice";
import TransactionFailureModal from "../NewTransactionPage/TransactionFailureModal";
import TransactionSuccessModal from "../NewTransactionPage/TransactionSuccessModal";
import { numberWithCommas } from "../../helpers";

const SendTab = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { walletInfo, params, externalKeys, internalKeys, xprv } = useContext(WalletContext);
  const [recipientAddress, setRecipientAddress] = useState(searchParams.get("recipient") ?? "");
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("");
  const [message, setMessage] = useState("");

  const [confirmModal, setConfirmModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState({});

  const [utxos, setUtxos] = useState([]);

  const getWalletUtxos = async () => {
    const results = await axios.post(
      `/wallet/utxos`,
      [...externalKeys, ...internalKeys].map(key => key.address)
    );
    console.log(results.data);
    setUtxos(results.data);
  };

  useEffect(getWalletUtxos, [externalKeys, internalKeys]);
  useEffect(() => {
    const amount = searchParams.get("amount");
    if (amount) handleAmountChange(amount);
  }, [searchParams]);

  const resetFields = () => {
    setRecipientAddress("");
    setAmount("");
    setFee("");
    setMessage("");
  };

  const handleAmountChange = amount => {
    let amt = parseFloat(amount);
    const places = Math.floor(amt.valueOf()) === amt.valueOf() ? 0 : amount.split(".")[1]?.length || 0;
    if (places > 8) amt = amt.toFixed(8);
    setAmount(isNaN(amt) ? "" : amt);
  };

  const handleFeeChange = amount => {
    let amt = parseFloat(amount);
    const places = Math.floor(amt.valueOf()) === amt.valueOf() ? 0 : amount.split(".")[1]?.length || 0;
    if (places > 8) amt = amt.toFixed(8);
    setFee(isNaN(amt) ? "" : amt);
  };

  const signAndSendTransaction = async e => {
    e.preventDefault();
    const _amount = Math.trunc(amount * params.coin);
    const _fee = Math.trunc(fee * params.coin);

    if (walletInfo.balance >= _amount && walletInfo.balance < _amount + _fee) {
      console.error("unsafe transaction: will pass Node validation, but fees will be different");
      // TODO: display error prompt
      setErrorModal(true);
      return;
    }

    // pick utxos from front to back.
    let inputAmount = 0;
    const inputs = [];
    for (const utxo of utxos) {
      if (inputAmount >= _amount + _fee) break;
      inputAmount += utxo.amount;

      console.log(utxo);
      const { publicKey } = [...externalKeys, ...internalKeys].find(({ address }) => address === utxo.address);
      const input = createInput(utxo.txHash, utxo.outIndex, publicKey);
      inputs.push(input);
    }

    const outputs = [];
    const payment = createOutput(recipientAddress, _amount);
    outputs.push(payment);

    const changeAmount = inputAmount - _amount - _fee;
    let changeKeys = null;
    if (changeAmount > 0) {
      changeKeys = deriveKeys(params, xprv, 0, 1, internalKeys.length);
      const change = createOutput(changeKeys.address, changeAmount);
      outputs.push(change);
    }

    const transaction = createTransaction(params, inputs, outputs, message);

    for (const input of transaction.inputs) {
      const { secretKey } = [...externalKeys, ...internalKeys].find(({ publicKey }) => publicKey === input.publicKey);
      const signature = signTransaction(transaction, secretKey);
      input.signature = signature;
    }

    transaction.hash = calculateTransactionHash(transaction);

    try {
      await axios.post(`/transaction`, transaction);
    } catch (e) {
      const validation = e.response.data;
      console.error("tx invalid: ", transaction);
      setError(validation);
      setErrorModal(true);
      return;
    }

    if (changeAmount > 0) {
      dispatch(addInternalKeys({ ...changeKeys, index: internalKeys.length }));
    }

    resetFields();
    setConfirmModal(true);
  };

  const { balance } = walletInfo;

  return (
    <main>
      <form onSubmit={signAndSendTransaction}>
        <div className="field mb-5">
          <label htmlFor="recipient-address" className="label">
            Recipient's Address
          </label>
          <div className="field has-addons mb-0">
            <div className="control is-expanded">
              <input
                id="recipient-address"
                className="input"
                type="text"
                placeholder="Enter Address"
                value={recipientAddress}
                onChange={({ target: { value } }) => setRecipientAddress(value)}
                required
                autoComplete="on"
              />
            </div>
            <p className="control">
              <button
                onClick={async () => {
                  setRecipientAddress(await navigator.clipboard.readText());
                  toast.success("Address pasted");
                }}
                className="button"
              >
                <i className="material-icons md-18">content_paste</i>
              </button>
            </p>
          </div>
        </div>

        <div className="is-flex-tablet mb-1" style={{ gap: "2em" }}>
          <div className="field" style={{ flexGrow: 1 }}>
            <label htmlFor="amount" className="label">
              Amount ({params.symbol})
            </label>
            <div className="field has-addons mb-0">
              <div className="control is-expanded">
                <input
                  id="amount"
                  className="input"
                  onChange={({ target }) => handleAmountChange(target.value)}
                  value={amount}
                  type="number"
                  min="0"
                  step=".01"
                  placeholder="0.00000000"
                  autoComplete="transaction-amount"
                  required
                />
              </div>

              <p className="control">
                <button onClick={() => handleAmountChange((balance / params.coin).toFixed(8))} className="button">
                  Max
                </button>
              </p>
            </div>
          </div>

          <div className="field" style={{ flexGrow: 1 }}>
            <label htmlFor="fee" className="label">
              Fee ({params.symbol})
            </label>
            <input
              id="fee"
              className="input"
              onChange={({ target }) => handleFeeChange(target.value)}
              value={fee}
              type="number"
              min="0"
              step=".01"
              placeholder="0.00000000"
              autoComplete="transaction-amount"
              required
            />
            <p className="help">Network fees sent to the miner.</p>
          </div>
        </div>

        <div className="field mb-6">
          <label htmlFor="message" className="label">
            Message
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            id="message"
            className="textarea"
            placeholder="Public message to the recipient"
            rows="3"
            autoComplete="on"
          />
          <p className="help is-flex">
            This message will be public and viewable by anyone with access to the blockchain.
            <span
              className={classNames("ml-auto", { "has-text-danger": message.length > params.txMsgMaxLen })}
              style={{ whiteSpace: "nowrap" }}
            >
              {message.length} / {params.txMsgMaxLen}
            </span>
          </p>
        </div>

        <div className="is-flex">
          <div
            style={{ display: "grid", gridTemplateColumns: "auto auto", columnGap: ".75em", alignItems: "baseline" }}
          >
            <span className="title is-6 m-0">Current balance:</span>
            <span className="">
              {numberWithCommas((balance / params.coin).toFixed(8))} {params.symbol}
            </span>
            <span className="title is-6 m-0">Balance after:</span>
            <span className="">
              {numberWithCommas((balance / params.coin - amount - fee).toFixed(8))} {params.symbol}
            </span>
          </div>

          <button type="submit" className="button is-dark is-flex ml-auto mt-auto" style={{ gap: ".5em" }}>
            <span className="material-icons has-text-white md-18">send</span>
            Sign & Send
          </button>
        </div>
      </form>

      <TransactionSuccessModal isOpen={confirmModal} close={() => setConfirmModal(false)} />
      <TransactionFailureModal isOpen={errorModal} close={() => setErrorModal(false)} error={error} />
    </main>
  );
};

export default SendTab;
