import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getUnconfirmedBlocks } from "../store/blockchainSlice";

export const useUnconfirmedBlocks = () => {
	const dispatch = useDispatch();
	const unconfirmedBlocks = useSelector(state => state.blockchain.unconfirmedBlocks);
	const fetched = useSelector(state => state.blockchain.unconfirmedBlocksFetched);

	const loading = !fetched;

	useEffect(() => {
		if (loading) dispatch(getUnconfirmedBlocks());
	}, [loading]);

	return [loading, unconfirmedBlocks];
};
