const {
  NODE_ENV,
  REACT_APP_BOBCOIN_NODE_ALPHA_MAINNET_URL,
  REACT_APP_BOBCOIN_NODE_ALPHA_TESTNET_URL,
  REACT_APP_BOBCOIN_NODE_LOCAL_MAINNET_URL,
  REACT_APP_BOBCOIN_NODE_LOCAL_TESTNET_URL,
  REACT_APP_RECAPTCHA_SITE_KEY,
} = process.env;

const development = NODE_ENV === "development";
const useProdNodeInDev = true;

export const recaptchaSiteKey = REACT_APP_RECAPTCHA_SITE_KEY;

export const nodes = [
  { name: "alpha-mainnet", url: REACT_APP_BOBCOIN_NODE_ALPHA_MAINNET_URL },
  { name: "alpha-testnet", url: REACT_APP_BOBCOIN_NODE_ALPHA_TESTNET_URL },
  { name: "local-mainnet", url: REACT_APP_BOBCOIN_NODE_LOCAL_MAINNET_URL },
  { name: "local-testnet", url: REACT_APP_BOBCOIN_NODE_LOCAL_TESTNET_URL },
];

// export const bobcoinMainnet =
//   development && !useProdNodeInDev ? REACT_APP_BOBCOIN_NODE_LOCAL_MAIN : REACT_APP_BOBCOIN_NODE_MAIN;

// export const bobcoinTestnet =
//   development && !useProdNodeInDev ? REACT_APP_BOBCOIN_NODE_LOCAL_TEST : REACT_APP_BOBCOIN_NODE_TEST;
