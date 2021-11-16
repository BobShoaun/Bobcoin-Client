import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { useParams } from "../../hooks/useParams";

import {
  getKeys,
  createInput,
  createOutput,
  createTransaction,
  signTransaction,
  calculateTransactionHash,
  hexToBase58,
  RESULT,
  signTransactionHex,
} from "blockcrypto";
import TransactionFailureModal from "./TransactionFailureModal";
import TransactionSuccessModal from "./TransactionSuccessModal";

import axios from "axios";
import toast from "react-hot-toast";

const NewTransactionPage = () => {
  const dispatch = useDispatch();

  const [status, params] = useParams();

  const keys = useSelector(state => state.wallet.keys);
  const api = useSelector(state => state.network.api);

  const history = useHistory();

  const [showSK, setShowSK] = useState(false);
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("");

  const [sk, setSK] = useState(keys.sk ?? "");
  const [sender, setSender] = useState({ sk: "", pk: "", address: "" });
  const [recipientAdd, setRecipientAdd] = useState("");
  const [skFormat, setSKFormat] = useState("base58");

  const [confirmModal, setConfirmModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState({});

  const resetFields = () => {
    setRecipientAdd("");
    setAmount("");
    setFee("");
  };

  useEffect(() => {
    updatePkAdd(sk);
  }, [skFormat, sk]);

  const updatePkAdd = secretKey => {
    try {
      const _sk = skFormat === "base58" ? secretKey : hexToBase58(secretKey);
      const { sk, pk, address } = getKeys(params, _sk);
      setSender({ sk, pk, address });
    } catch {
      setSender({ sk: "", pk: "", address: "" });
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

    const utxos = (await axios(`${api}/utxo/mempool/${sender.address}`)).data;

    // pick utxos from front to back.
    let inputAmount = 0;
    const inputs = [];
    for (const utxo of utxos) {
      if (inputAmount >= _amount) break;
      inputAmount += utxo.amount;
      const input = createInput(utxo.txHash, utxo.outIndex, sender.pk);
      inputs.push(input);
    }

    const outputs = [];
    const payment = createOutput(recipientAdd, _amount);
    outputs.push(payment);

    const changeAmount = inputAmount - _amount - _fee;
    if (changeAmount > 0) {
      const change = createOutput(sender.address, changeAmount);
      outputs.push(change);
    }

    const transaction = createTransaction(params, inputs, outputs);
    const signature = signTransaction(transaction, sender.sk);
    transaction.inputs.forEach(input => (input.signature = signature));
    transaction.hash = calculateTransactionHash(transaction);

    const validation = (await axios.post(`${api}/transaction`, { transaction })).data;

    if (validation.code !== RESULT.VALID) {
      console.error("tx invalid: ", transaction);
      setError(validation);
      setErrorModal(true);
      return;
    }

    resetFields();
    setConfirmModal(true);
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
              onClick={() => setSKFormat("base58")}
              className="is-clickable"
              style={{
                textDecoration: skFormat === "base58" ? "underline" : "",
              }}
            >
              Base58
            </span>
            <span className="mx-3">|</span>
            <span
              onClick={() => setSKFormat("hex")}
              className="is-clickable"
              style={{
                textDecoration: skFormat === "hex" ? "underline" : "",
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
              type={showSK ? "text" : "password"}
              placeholder="Enter private key"
              value={sk}
              onChange={({ target: { value } }) => setSK(value)}
            ></input>
          </div>
          <p className="control">
            <button onClick={() => setShowSK(showSK => !showSK)} className="button">
              <i className="material-icons md-18">{showSK ? "visibility_off" : "visibility"}</i>
            </button>
          </p>
        </div>
        <p className="help">You can only spend from an address which you have the private key.</p>
      </div>

      <div className="field mb-4">
        <label className="label">Sender's Public key</label>
        <input
          value={sender.pk}
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
              value={recipientAdd}
              onChange={({ target: { value } }) => setRecipientAdd(value)}
            ></input>
          </div>
          <p className="control">
            <button
              onClick={async () => {
                setRecipientAdd(await navigator.clipboard.readText());
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
