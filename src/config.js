const {
  NODE_ENV,
  REACT_APP_NODE_MAINNET_ALPHA_URL,
  REACT_APP_NODE_TESTNET_ALPHA_URL,
  REACT_APP_NODE_MAINNET_LOCAL_URL,
  REACT_APP_NODE_TESTNET_LOCAL_URL,
  REACT_APP_RECAPTCHA_SITE_KEY,
} = process.env;

export const recaptchaSiteKey = REACT_APP_RECAPTCHA_SITE_KEY;

export const nodes = [
  { name: "mainnet-alpha", url: REACT_APP_NODE_MAINNET_ALPHA_URL },
  { name: "testnet-alpha", url: REACT_APP_NODE_TESTNET_ALPHA_URL },
  { name: "mainnet-local", url: REACT_APP_NODE_MAINNET_LOCAL_URL },
  { name: "testnet-local", url: REACT_APP_NODE_TESTNET_LOCAL_URL },
];

export const donationAddress = "8bobLqxCRPTSEhvZwQTeKnKz5429N26";
export const discordInviteLink = "https://discord.gg/Mr9kzmc6eh";
export const personalWebsiteLink = "https://bobng.me";

export const nodeDonationPercent = 0.1;
export const nodeDonationAddress = "8WHdkueKmPjbmAH1Va9uZpC2v7Xbqkw";

export const VCODE = {
  BK00: 0,
  BK01: 1,
  BK02: 2,
  BK03: 3,
  BK04: 4,
  BK05: 5,
  BK06: 6,
  BK07: 7,

  TX00: 100,
  TX01: 101,
  TX02: 102,
  TX03: 103,
  TX04: 104,
  TX05: 105,
  TX06: 106,
  TX07: 107,
  TX08: 108,
  TX09: 109,
  TX10: 110,
  TX11: 111,

  CB00: 200,
  CB01: 201,
  CB02: 202,
  CB03: 203,
  CB04: 204,
  CB05: 205,
  CB06: 206,
  CB07: 207,

  BC00: 300,
  BC01: 301,
  BC02: 302,
  BC03: 303,
  BC04: 304,
  BC05: 305,

  VALID: 400,
};
