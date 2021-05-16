onmessage = function (e) {
	console.log("worker: ", e);
	postMessage("done");
};
