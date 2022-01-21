import toast from "react-hot-toast";

export async function copyToClipboard(text, prompt) {
  await navigator.clipboard.writeText(text);
  toast.success(prompt);
}

export const getMaxDecimalPlaces = numbers =>
  Math.max(...numbers.map(number => number.toString().split(".")[1]?.length || 0));

export const numberWithCommas = x => x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
