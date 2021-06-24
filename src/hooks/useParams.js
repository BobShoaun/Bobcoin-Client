import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getParams } from "../store/consensusSlice";

export const useParams = () => {
	const dispatch = useDispatch();
	const { status, params } = useSelector(state => state.consensus);

	useEffect(() => {
		if (status !== "success") dispatch(getParams());
	}, []);

	return [status, params];
};
