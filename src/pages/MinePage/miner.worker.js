import { mineNewBlock } from "blockcrypto";

onmessage = mineBlock;

function mineBlock({ data }) {
	const { params, blockchain, headBlock, txToMine } = data;
	let block = {};

	for (block of mineNewBlock(params, blockchain, headBlock, txToMine, target =>
		postMessage({ message: "target", target })
	)) {
		if (block.nonce % 20000 === 0 && block.nonce > 0) postMessage({ message: "nonce", block });
	}
	postMessage({ message: "success", block });
}
