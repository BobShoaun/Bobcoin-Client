import { combineReducers } from "redux";
import * as actionTypes from "../actions/types.js";
import { Cryptocurrency, Transaction } from "blockchain-crypto";
import _ from "lodash";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("incoming block", function (block) {
	console.log("incoming block", block);
});

// const transactionsReducer = (state = [], action) => {
//   switch(action.type) {
//     case actionTypes.ADD_TRANSACTION:
//       return [...state, action.payload];
//     case actionTypes.MINE_TRANSACTIONS:
//       return state;
//     default:
//       return state;
//   }
// }

const blockchainReducer = (state = new Cryptocurrency(), action) => {
	switch (action.type) {
		case actionTypes.ADD_TRANSACTION: {
			const blockchain = _.cloneDeep(state);
			const { senderPK, recipientPK, amount, senderSK } = action.payload;
			const transaction = new Transaction(senderPK, recipientPK, amount);
			transaction.sign(senderSK);
			blockchain.addTransaction(transaction);
			return blockchain;
		}
		case actionTypes.MINE_TRANSACTIONS: {
			const blockchain = _.cloneDeep(state);
      const { minerPK, transactions, prevBlock } = action.payload;
			let block = blockchain.mineTransactions(minerPK, transactions, prevBlock);

			socket.emit("add block", block);
			return blockchain;
		}
		default: {
			return state;
		}
	}
};

const numberReducer = (state = 0, action) => {
	switch (action.type) {
		case actionTypes.TEST:
			return state + 1;
		default:
			return state;
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
	number: numberReducer,
});
