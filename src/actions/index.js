import * as types from './types.js';

export const addTransaction = transaction => ({
  type: types.ADD_TRANSACTION,
  payload: transaction,
})

export const mineTransactions = miner => ({
  type: types.MINE_TRANSACTIONS,
  payload: miner,
})

export const addNumber = () => ({
  type: types.TEST,
  payload: null,
})