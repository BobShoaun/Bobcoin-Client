import { useState } from "react";
import { Link } from "react-router-dom";

const NewTransactionAction = () => {
  const [expandButton, setExpandButton] = useState(false);

  const floatingButton = {
    position: "fixed",
    right: "2rem",
    bottom: "2rem",
    borderRadius: "2rem",
    height: "4rem",
  };
  return (
    <Link
      style={{
        ...floatingButton,
        overflow: "hidden",
      }}
      onMouseEnter={() => setExpandButton(true)}
      onMouseLeave={() => setExpandButton(false)}
      to="/send"
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
