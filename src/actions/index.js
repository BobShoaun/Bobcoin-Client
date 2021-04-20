import * as types from './types.js';

export const addTransaction = (senderPK, recipientPK, amount, senderSK) => ({
  type: types.ADD_TRANSACTION,
  payload: {
    senderPK,
    recipientPK,
    amount,
    senderSK
  },
})

export const mineTransactions = (minerPK, transactions, prevBlock) => ({
  type: types.MINE_TRANSACTIONS,
  payload: {
    minerPK,
    transactions,
    prevBlock
  },
})

export const addNumber = () => ({
  type: types.TEST,
  payload: null,
})