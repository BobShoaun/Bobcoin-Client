import { mineNewBlock } from "blockchain-crypto";

onmessage = mineBlock;

function mineBlock({ data }) {
	const { params, blockchain, headBlock, txToMine, miner } = data;
	let block = {};
	for (block of mineNewBlock(params, blockchain, headBlock, txToMine, miner, target =>
		postMessage({ message: "target", target })
	)) {
		if (block.nonce % 10000 === 0 && block.nonce > 0) postMessage({ message: "nonce", block });
	}
	postMessage({ message: "success", block });
}
