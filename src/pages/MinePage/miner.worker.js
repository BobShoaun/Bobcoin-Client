import { mineNewBlock } from "blockchain-crypto";

onmessage = mineBlock;

function mineBlock({ data }) {
	const { blockchain, headBlock, txToMine, miner } = data;
	let block = {};
	for (block of mineNewBlock(blockchain, headBlock, txToMine, miner, target =>
		postMessage({ message: "target", target })
	)) {
		if (block.nonce % 10000 === 0 && block.nonce > 0) postMessage({ message: "nonce", block });
	}
	postMessage({ message: "success", block });
}
