import { combineReducers } from "redux";
import * as actionTypes from "../actions/types.js";
import { Cryptocurrency } from "blockchain-crypto";
import _ from 'lodash';

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
			blockchain.addTransaction(action.payload);
			return blockchain;
		}
		case actionTypes.MINE_TRANSACTIONS: {
      const blockchain = _.cloneDeep(state);
			blockchain.minePendingTransactions(action.payload);
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

export default combineReducers({
	blockchain: blockchainReducer,
	number: numberReducer,
});
