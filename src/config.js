const {
  NODE_ENV,
  REACT_APP_BOBCOIN_NODE_MAIN,
  REACT_APP_BOBCOIN_NODE_TEST,
  REACT_APP_BOBCOIN_NODE_LOCAL_MAIN,
  REACT_APP_BOBCOIN_NODE_LOCAL_TEST,
  REACT_APP_RECAPTCHA_SITE_KEY,
} = process.env;

const development = NODE_ENV === "development";
const useProdNodeInDev = false;

export const recaptchaSiteKey = REACT_APP_RECAPTCHA_SITE_KEY;

export const bobcoinMainnet =
  development && !useProdNodeInDev ? REACT_APP_BOBCOIN_NODE_LOCAL_MAIN : REACT_APP_BOBCOIN_NODE_MAIN;

export const bobcoinTestnet =
  development && !useProdNodeInDev ? REACT_APP_BOBCOIN_NODE_LOCAL_TEST : REACT_APP_BOBCOIN_NODE_TEST;
