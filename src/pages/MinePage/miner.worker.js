import { mineBlock } from "blockcrypto";

onmessage = mine;

function mine({ data }) {
  let { block, target } = data;
  for (block of mineBlock(block, target)) {
    if (block.nonce % 20000 === 0 && block.nonce > 0) postMessage({ message: "nonce", block });
  }
  postMessage({ message: "success", block });
}
