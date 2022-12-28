import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { copyToClipboard } from "../helpers";
import { discordInviteLink, personalWebsiteLink, donationAddress, donationAmountSuggestion } from "../config";

const Footer = () => {
  const { params } = useSelector(state => state.consensus);
  const { mnemonic } = useSelector(state => state.wallet);

  const donationURLParams = new URLSearchParams();
  donationURLParams.set("recipient", donationAddress);
  donationURLParams.set("amount", donationAmountSuggestion);

  return (
    <footer className="footer has-background-dark has-text-grey-light">
      <div className="content has-text-centered">
        <p className="is-size-7 is-size-6-tablet">
          Interested? Join the{" "}
          <a className="has-text-white has-text-weight-medium" href={discordInviteLink} target="_blank">
            Discord
          </a>{" "}
          community.
        </p>
        <p className="is-size-7 is-size-6-tablet ">
          Like this project? Consider donating to{" "}
          <Link
            to={mnemonic ? `/wallet?${donationURLParams}#send` : `/transaction/create?${donationURLParams}`}
            className="has-text-white has-text-weight-medium"
            // onClick={() => copyToClipboard(donationAddress, "Address copied")}
          >
            {donationAddress}
          </Link>
        </p>
        <p className="is-size-7 is-size-6-tablet">
          <strong className="has-text-white has-text-weight-semibold">{params?.name}</strong> by{" "}
          <a className="has-text-primary" target="_blank" href={personalWebsiteLink}>
            Ng Bob Shoaun
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
