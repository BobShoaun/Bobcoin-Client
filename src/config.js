const {
	NODE_ENV,
	REACT_APP_BOBCOIN_NODE_MAIN,
	REACT_APP_BOBCOIN_NODE_TEST,
	REACT_APP_BOBCOIN_NODE_LOCAL,
} = process.env;

const development = NODE_ENV !== "development";

export const bobcoinMainnet = development
	? REACT_APP_BOBCOIN_NODE_LOCAL
	: REACT_APP_BOBCOIN_NODE_MAIN;

export const bobcoinTestnet = development
	? REACT_APP_BOBCOIN_NODE_LOCAL
	: REACT_APP_BOBCOIN_NODE_TEST;
