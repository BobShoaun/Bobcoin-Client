import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NewTransactionAction = () => {
  const [expandButton, setExpandButton] = useState(false);
  const { mnemonic } = useSelector(state => state.wallet);

  return (
    <Link
      style={{
        position: "fixed",
        right: "3rem",
        bottom: "2rem",
        borderRadius: "3rem",
        height: "4rem",
        overflow: "hidden",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      }}
      onMouseEnter={() => setExpandButton(true)}
      onMouseLeave={() => setExpandButton(false)}
      to={mnemonic ? "/wallet#send" : "/transaction/create"}
      className="button is-link"
    >
      <div className="is-flex is-align-items-center test">
        <span
          style={{
            transform: expandButton ? "rotate(360deg)" : "rotate(0deg)",
            transition: "transform 0.5s ease-in-out 0.3s",
          }}
          className="material-icons md-36"
        >
          attach_money
        </span>
        <strong
          style={{
            transition: "width 0.4s ease-out",
            visibility: expandButton ? "visible" : "hidden",
            width: expandButton ? "10rem" : "0rem",
          }}
        >
          New Transaction
        </strong>
      </div>
    </Link>
  );
};

export default NewTransactionAction;
