import { combineReducers } from "redux";
import * as actionTypes from "../actions/types.js";
import { mineGenesisBlock, createBlockchain, resetCache } from "blockchain-crypto";
import _ from "lodash";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("incoming block", function (block) {
	console.log("incoming block", block);
});

const initialState = {
	blockchain: null,
	transactions: [],
};

const blockchainReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.INIT: {
			resetCache();
			const genesis = mineGenesisBlock("genesis");
			return {
				...state,
				blockchain: createBlockchain([genesis]),
			};
		}
		// case actionTypes.ADD_TRANSACTIONS: {
		// 	return {
		// 		...state,
		// 		transactions: [...state.transactions, ...action.payload.transactions],
		// 	};
		// const blockchain = _.cloneDeep(state);
		// const { senderPK, recipientPK, amount, senderSK } = action.payload;
		// const transaction = new Transaction(senderPK, recipientPK, amount);
		// transaction.sign(senderSK);
		// blockchain.addTransaction(transaction);
		// return blockchain;
		// }
		case actionTypes.MINE_TRANSACTIONS: {
			// const blockchain = _.cloneDeep(state);
			// const { minerPK, transactions, prevBlock } = action.payload;
			// let block = blockchain.mineTransactions(minerPK, transactions, prevBlock);
			// socket.emit("add block", block);
			// return blockchain;
		}
		default: {
			return state;
		}
	}
};

async function addBlock(block) {
	// const res = await axios.post("http://localhost:3001/blocks", block);
	// console.log(res);
	socket.emit("add block", block);
	// socket.on('add-block', () => {

	// })
}

export default combineReducers({
	blockchain: blockchainReducer,
});
