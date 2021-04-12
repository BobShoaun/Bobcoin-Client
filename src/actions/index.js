import * as types from './types.js';

export const addTransaction = transaction => ({
  type: types.ADD_TRANSACTION,
  payload: transaction,
  
})