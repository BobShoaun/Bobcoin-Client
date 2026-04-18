import { useState, useEffect } from "react";

const useErrorTimeout = (durationMS = 5000) => {

    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const errorTimeout = setTimeout(() => {
            setIsError(true);
        }, durationMS);
        return () => clearTimeout(errorTimeout);
    }, []);

    return isError;
}

export default useErrorTimeout;