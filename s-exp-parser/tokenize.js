const readUntil = (predicate, escapeChar = "") => (string, i) => {
  let out = "";
  while (!predicate(string[i]) && string[i]) {
    if (string[i] === escapeChar) {
      string[i + 1] && (out += string[i + 1]);
      i += 2;
      continue;
    }
    out += string[i];
    i++;
  }
  return out;
};

const makeToken = (text, start, end) => ({
  text,
  start,
  end: end != null ? end : start + text.length,
});

const isWhitespace = (char) => char === " ";
const isWordEnd = (char) => isWhitespace(char) || char === "(" || char === ")";
const isDoubleQuotes = (char) => char === '"';

const readStringLiteral = readUntil(isDoubleQuotes, "\\");
const readWord = readUntil(isWordEnd);

export const tokenize = (string) => {
  const out = [];
  let i = 0;
  while (i < string.length) {
    switch (true) {
      case string[i] === "(":
      case string[i] === ")":
        out.push(makeToken(string[i], i));
        break;
      case isWhitespace(string[i]):
        break;
      case string[i] === '"':
        const stringLiteral = readStringLiteral(string, i + 1);
        out.push(makeToken(stringLiteral, i, i + stringLiteral.length + 2));
        i += stringLiteral.length + 1;
        break;
      default:
        const word = readWord(string, i);
        out.push(makeToken(word, i));
        i += word.length - 1;
    }
    i++;
  }
  return out;
};
