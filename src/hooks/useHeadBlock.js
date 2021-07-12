import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getHeadBlock } from "../store/blockchainSlice";

export const useHeadBlock = () => {
	const dispatch = useDispatch();
	const headBlock = useSelector(state => state.blockchain.headBlock);
	const fetched = useSelector(state => state.blockchain.headBlockFetched);

	const loading = !fetched;

	// useEffect(() => {
	// 	if (loading) dispatch(getHeadBlock());
	// }, [loading]);

	return [loading, headBlock];
};
