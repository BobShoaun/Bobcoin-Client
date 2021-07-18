export async function copyToClipboard(text) {
	await navigator.clipboard.writeText(text);
	alert(`copied ${text} to clipboard!`);
}

export const getMaxDecimalPlaces = numbers =>
	Math.max(...numbers.map(number => number.toString().split(".")[1]?.length || 0));
