export const asTextNodes = (x) => (x.length ? x.map(asTextNodes) : x.text);
