import { combineReducers } from "redux";
import * as actionTypes from "../actions/types.js";

const transactionsReducer = (state = [], action) => {
  switch(action.type) {
    case actionTypes.ADD_TRANSACTION:
      return [...state, action.payload];
    case actionTypes.MINE_TRANSACTIONS:
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  transactions: transactionsReducer,
})
