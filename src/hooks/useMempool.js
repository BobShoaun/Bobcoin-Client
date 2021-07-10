import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getMempool } from "../store/blockchainSlice";

export const useMempool = () => {
	const dispatch = useDispatch();
	const mempool = useSelector(state => state.blockchain.mempool);
	const fetched = useSelector(state => state.blockchain.mempoolFetched);

	const loading = !fetched;

	useEffect(() => {
		if (loading) dispatch(getMempool());
	}, [loading]);

	return [loading, mempool];
};
