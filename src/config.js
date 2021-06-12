const {
	NODE_ENV,
	REACT_APP_BOBCOIN_NODE_MAIN,
	REACT_APP_BOBCOIN_NODE_TEST,
	REACT_APP_BOBCOIN_NODE_LOCAL,
} = process.env;

const development = NODE_ENV === "development";
const useProdNodeInDev = true;

export const bobcoinMainnet =
	development && !useProdNodeInDev ? REACT_APP_BOBCOIN_NODE_LOCAL : REACT_APP_BOBCOIN_NODE_MAIN;

export const bobcoinTestnet =
	development && !useProdNodeInDev ? REACT_APP_BOBCOIN_NODE_LOCAL : REACT_APP_BOBCOIN_NODE_TEST;
