import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getParams } from "../store/consensusSlice";

export const useParams = () => {
	const dispatch = useDispatch();
	const { fetched, params } = useSelector(state => state.consensus);

	useEffect(() => {
		if (!fetched) dispatch(getParams());
	}, []);

	return [!fetched, params];
};
