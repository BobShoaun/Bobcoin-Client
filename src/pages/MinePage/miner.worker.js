import { mineBlock, calculateBlockHash, hexToBigInt } from "blockcrypto";

const soloMiner = (_block, target) => {
  let block = _block;
  for (block of mineBlock(block, target)) {
    if (block.nonce % 50000 === 0 && block.nonce > 0) postMessage({ message: "nonce", block });
  }
  postMessage({ message: "success", block });
};

const poolMiner = (block, target) => {
  while (true) {
    block.hash = calculateBlockHash(block);
    const currentHash = hexToBigInt(block.hash);
    if (currentHash <= target) {
      // mining successful
      postMessage({ message: "success", block });
      return;
    }
    block.nonce++;
    if (block.nonce % 50000 === 0) postMessage({ message: "nonce", block });
  }
};

onmessage = ({ data }) => {
  switch (data.type) {
    case "solo":
      soloMiner(data.block, data.target);
      break;
    case "pool":
      poolMiner(data.block, data.target);
      break;
  }
};
