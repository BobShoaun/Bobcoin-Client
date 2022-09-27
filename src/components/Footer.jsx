import React from "react";
import { useSelector } from "react-redux";
import { copyToClipboard } from "../helpers";
import { discordInviteLink, personalWebsiteLink, donationAddress } from "../config";

const Footer = () => {
  const params = useSelector(state => state.consensus.params);

  return (
    <footer className="footer has-background-dark has-text-grey-light">
      <div className="content has-text-centered">
        <p className="is-size-7 is-size-6-tablet">
          Interested? Join the{" "}
          <a className="has-text-link" href={discordInviteLink} target="_blank" style={{ textDecoration: "underline" }}>
            Discord
          </a>{" "}
          community.
        </p>
        <p className="is-size-7 is-size-6-tablet ">
          Like this project? Consider donating to{" "}
          <span
            className="is-clickable"
            onClick={() => copyToClipboard(donationAddress, "Address copied")}
            style={{ textDecoration: "underline" }}
          >
            {donationAddress}
          </span>
        </p>
        <p className="is-size-7 is-size-6-tablet">
          <strong className="has-text-white">{params.name}</strong> by{" "}
          <a className="has-text-primary" target="_blank" href={personalWebsiteLink}>
            Ng Bob Shoaun
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
