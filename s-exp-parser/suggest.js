const unique = (e, i, a) => a.indexOf(e) === i;

const SUGGEST_LIMIT = 20;

const findToken = (parsed, selection) => {
  if (Array.isArray(parsed)) {
    for (let elem of parsed) {
      const tokHuh = findToken(elem, selection);
      if (tokHuh) {
        return tokHuh;
      }
    }
    return null;
  }

  if (parsed.start <= selection && parsed.end >= selection) {
    return parsed;
  }
};

const findNewTokenType = (parsed, tokens, selection) => {
  return "UNKNOWN";
};

const getSuggestionToken = (parsed, tokens, selection, focus) => {
  if (!focus || !parsed) {
    return {
      options: "NO_SUGGESTIONS",
    };
  }

  const midToken = findToken(parsed, selection);
  if (midToken) {
    return midToken;
  }

  return {
    text: "",
    start: selection,
    end: selection,
    options: findNewTokenType(parsed, tokens, selection),
  };
};

export const suggest = (parsed, tokens, selection, focus, dict) => {
  const { options, text } = getSuggestionToken(
    parsed,
    tokens,
    selection,
    focus
  );
  if (options === "NO_SUGGESTIONS") {
    return [];
  }
  if (!dict[options]) {
    return [];
  }
  const dictOptions = dict[options];
  if (Array.isArray(dictOptions)) {
    return [
      ...dictOptions.filter((option) =>
        option.toLowerCase().startsWith(text.toLowerCase())
      ),
      ...dictOptions.filter((option) =>
        option.toLowerCase().includes(text.toLowerCase())
      ),
    ]
      .filter(unique)
      .slice(0, SUGGEST_LIMIT);
  }
  return dictOptions(text).slice(0, SUGGEST_LIMIT);
};

export const replaceSuggestionToken = (
  rawText,
  parsed,
  tokens,
  selection,
  focus,
  replacementText
) => {
  const { start, end } = getSuggestionToken(parsed, tokens, selection, focus);

  const safeReplacementText = replacementText.includes(" ")
    ? `"${replacementText}"`
    : replacementText;

  return rawText.substr(0, start) + safeReplacementText + rawText.substr(end);
};
