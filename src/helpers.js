import toast from "react-hot-toast";

export async function copyToClipboard(text, prompt) {
  await navigator.clipboard.writeText(text);
  toast.success(prompt);
}

export const getMaxDecimalPlaces = numbers =>
  Math.max(...numbers.map(number => number.toString().split(".")[1]?.length || 0));

export const numberWithCommas = x => x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

export const getBlockStatus = (block, headBlock, params) => {
  const confirmations = headBlock.height - block.height + 1;
  const isMature = confirmations > params.blkMaturity + 1;
  return {
    text: block.valid ? `${confirmations.toLocaleString()} Confirmations` : "Orphaned",
    colorClass: block.valid
      ? isMature
        ? "has-background-success"
        : `confirmations-${confirmations}`
      : "has-background-danger",
  };
};

export const getTransactionStatus = (transaction, headBlock, params) => {
  const confirmations = transaction.block?.valid ? headBlock?.height - transaction.block.height + 1 : 0;
  const isMature = confirmations > params.blkMaturity + 1;
  return {
    text: transaction.block
      ? transaction.block.valid
        ? `${confirmations.toLocaleString()} Confirmations`
        : "Orphaned"
      : "Pending (in mempool)",
    colorClass: transaction.block
      ? transaction.block.valid
        ? isMature
          ? "has-background-success"
          : `confirmations-${confirmations}`
        : "has-background-danger"
      : "has-background-warning",
  };
};
