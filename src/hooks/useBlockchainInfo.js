import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getBlockchain } from "../store/blockchainSlice";

export const useBlockchainInfo = () => {
	const dispatch = useDispatch();
	const blockchainInfo = useSelector(state => state.blockchain.chain);

	const loadBlockchain = () => dispatch(getBlockchain());

	useEffect(() => {
		if (!blockchainInfo.length) loadBlockchain();
	}, []);

	return [blockchainInfo, loadBlockchain];
};
