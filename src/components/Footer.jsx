import React from "react";
import { useSelector } from "react-redux";
import { copyToClipboard } from "../helpers";

const Footer = () => {
  const params = useSelector(state => state.consensus.params);

  const address = "8bobLqxCRPTSEhvZwQTeKnKz5429N26";

  return (
    <footer className="footer has-background-dark has-text-grey-light">
      <div className="content has-text-centered">
        <p className="is-size-7 is-size-6-tablet ">
          Like this project? Consider donating to{" "}
          <span
            className="is-clickable"
            onClick={() => copyToClipboard(address, "Address copied")}
            style={{ textDecoration: "underline" }}
          >
            {address}
          </span>
        </p>
        <p className="is-size-7 is-size-6-tablet">
          <strong className="has-text-white">{params.name}</strong> by{" "}
          <a className="has-text-primary" target="_blank" href="https://bobng.me">
            Ng Bob Shoaun
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
