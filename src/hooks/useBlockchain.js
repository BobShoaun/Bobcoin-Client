import { useSelector } from "react-redux";

export const useBlockchain = () => {
	const blockchain = useSelector(state => state.blockchain.chain);
	const blockchainFetched = useSelector(state => state.blockchain.fetched);
	const params = useSelector(state => state.consensus.params);
	const paramsFetched = useSelector(state => state.consensus.fetched);
	const transactions = useSelector(state => state.transactions.txs);
	const transactionsFetched = useSelector(state => state.transactions.fetched);

	const loading = !blockchainFetched || !paramsFetched || !transactionsFetched;
	return [loading, params, blockchain, transactions];
};
