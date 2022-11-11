import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  getKeys,
  createInput,
  createOutput,
  createTransaction,
  signTransaction,
  calculateTransactionHash,
  base58ToHex,
} from "blockcrypto";
import { VCODE } from "../../config";
import TransactionFailureModal from "./TransactionFailureModal";
import TransactionSuccessModal from "./TransactionSuccessModal";

import axios from "axios";
import toast from "react-hot-toast";

const NewTransactionPage = () => {
  const keys = useSelector(state => state.wallet.keys);
  const { params } = useSelector(state => state.consensus);

  const history = useHistory();

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("");

  const [senderSecretKey, setSenderSecretKey] = useState(keys.secretKey ?? "");
  const [sender, setSender] = useState({ secretKey: "", publicKey: "", address: "" });
  const [recipientAddress, setRecipientAddress] = useState("");
  const [secretKeyFormat, setSecretKeyFormat] = useState("hex");

  const [confirmModal, setConfirmModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState({});

  const resetFields = () => {
    setRecipientAddress("");
    setAmount("");
    setFee("");
  };

  useEffect(() => {
    updateSender(senderSecretKey);
  }, [secretKeyFormat, senderSecretKey]);

  const updateSender = secretKey => {
    try {
      const keys = getKeys(params, secretKeyFormat === "base58" ? base58ToHex(secretKey) : secretKey);
      setSender(keys);
    } catch {
      setSender({ secretKey: "", publicKey: "", address: "" });
    }
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

  const createAndSignTransaction = async () => {
    const _amount = Math.trunc(amount * params.coin);
    const _fee = Math.trunc(fee * params.coin);

    const { data: utxos } = await axios(`/utxos/${sender.address}`);

    // pick utxos from front to back.
    let inputAmount = 0;
    const inputs = [];
    for (const utxo of utxos) {
      if (inputAmount >= _amount) break;
      inputAmount += utxo.amount;
      const input = createInput(utxo.txHash, utxo.outIndex, sender.publicKey);
      inputs.push(input);
    }

    const outputs = [];
    const payment = createOutput(recipientAddress, _amount);
    outputs.push(payment);

    const changeAmount = inputAmount - _amount - _fee;
    if (changeAmount > 0) {
      const change = createOutput(sender.address, changeAmount);
      outputs.push(change);
    }

    const transaction = createTransaction(params, inputs, outputs);
    const signature = signTransaction(transaction, sender.secretKey);
    transaction.inputs.forEach(input => (input.signature = signature));
    transaction.hash = calculateTransactionHash(transaction);

    try {
      await axios.post(`/transaction`, transaction);
      resetFields();
      setConfirmModal(true);
    } catch (e) {
      console.error("tx invalid: ", transaction);
      const validation = e.response.data;
      setError(validation);
      setErrorModal(true);
    }
  };

  return (
    <section className="section">
      <h1 className="title is-size-4 is-size-2-tablet">New Transaction</h1>
      <p className="subtitle is-size-6 is-size-5-tablet">
        Create, sign and broadcast a new transaction. (Transactions made from your wallet should be done in My Wallet
        &gt; Send)
      </p>

      <div className="field mb-4">
        <label className="label">
          Sender's Private key
          <span className="ml-4 is-size-7 has-text-weight-normal">
            <span
              onClick={() => setSecretKeyFormat("base58")}
              className="is-clickable"
              style={{
                textDecoration: secretKeyFormat === "base58" ? "underline" : "",
              }}
            >
              Base58
            </span>
            <span className="mx-3">|</span>
            <span
              onClick={() => setSecretKeyFormat("hex")}
              className="is-clickable"
              style={{
                textDecoration: secretKeyFormat === "hex" ? "underline" : "",
              }}
            >
              Hex
            </span>
          </span>
        </label>
        <div className="field has-addons mb-0">
          <div className="control is-expanded">
            <input
              className="input"
              type={showSecretKey ? "text" : "password"}
              placeholder="Enter private key"
              value={senderSecretKey}
              onChange={({ target: { value } }) => setSenderSecretKey(value)}
            ></input>
          </div>
          <p className="control">
            <button onClick={() => setShowSecretKey(showSK => !showSK)} className="button">
              <i className="material-icons md-18">{showSecretKey ? "visibility_off" : "visibility"}</i>
            </button>
          </p>
        </div>
        <p className="help">You can only spend from an address which you have the private key.</p>
      </div>

      <div className="field mb-4">
        <label className="label">Sender's Public key</label>
        <input
          value={sender.publicKey}
          className="input"
          type="text"
          placeholder="Input private key above to get public key"
          readOnly
        ></input>
        <p className="help">The public key of the sender generated from the private key above. (read only)</p>
      </div>

      <div className="field mb-4">
        <label className="label">Sender's Address</label>
        <input
          value={sender.address}
          className="input"
          type="text"
          placeholder="Input private key above to get address"
          readOnly
        ></input>
        <p className="help">The address of the sender generated from the public key above. (read only)</p>
      </div>

      <div className="field mb-5">
        <label className="label">Recipient's Address</label>
        <div className="field has-addons mb-0">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Enter Address"
              value={recipientAddress}
              onChange={({ target: { value } }) => setRecipientAddress(value)}
            ></input>
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
        {/* <p className="help">The public key of the recipient of this transaction.</p> */}
      </div>

      <div className="is-flex mb-6">
        <div className="field mr-5" style={{ flexGrow: 1 }}>
          <label className="label">Amount ({params.symbol})</label>
          <input
            className="input"
            onChange={({ target }) => handleAmountChange(target.value)}
            value={amount}
            type="number"
            min="0"
            step=".01"
            placeholder="0.00000000"
          />
        </div>

        <div className="field" style={{ flexGrow: 1 }}>
          <label className="label">Fee ({params.symbol})</label>
          <input
            className="input"
            onChange={({ target }) => handleFeeChange(target.value)}
            value={fee}
            type="number"
            min="0"
            step=".01"
            placeholder="0.00000000"
          />
          <p className="help">Network fees sent to the miner.</p>
        </div>
      </div>

      <div className="buttons is-pulled-right">
        <button onClick={history.goBack} className="button">
          Cancel
        </button>
        <button className="button is-link has-text-weight-semibold" onClick={createAndSignTransaction}>
          <span className="material-icons-outlined mr-2">payments</span>
          Sign & Send
        </button>
      </div>
      <div className="is-clearfix"></div>

      <TransactionSuccessModal isOpen={confirmModal} close={() => setConfirmModal(false)} />
      <TransactionFailureModal isOpen={errorModal} close={() => setErrorModal(false)} error={error} />
    </section>
  );
};

export default NewTransactionPage;
