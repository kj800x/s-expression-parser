import { useEffect, useState } from "react";

import { tokenize } from "s-exp-parser/tokenize";
import { parse } from "s-exp-parser/parse";
import { suggest, replaceSuggestionToken } from "s-exp-parser/suggest";
import { annotate } from "s-exp-parser/annotate";

const QUERY_LANGUAGE_DICTIONARY = ({
  TITLES,
  AUTHORS,
  INGREDIENTS,
  SITES,
  TAGS,
}) => ({
  FUNCS: [
    "and",
    "or",
    "not",
    "title",
    "author",
    "ingredient",
    "tag",
    "source-site",
    "rating",
  ],
  TITLES,
  INGREDIENTS,
  AUTHORS,
  SITES,
  TAGS,
  RATINGS: ["0", "1", "2", "3", "4", "5", "null"],
});

const ANNOTATE_CONFIG = {
  defaultRoot: "",
  recursiveFuncs: ["and", "or", "not", "__IMPLICIT__"],
  title: "TITLES",
  author: "AUTHORS",
  ingredient: "INGREDIENTS",
  rating: "RATINGS",
  tag: "TAGS",
  "source-site": "SITES",
};

export const useSuggest = (initialValue, DICTIONARY) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => setValue(initialValue), [initialValue]);
  const [selection, setSelection] = useState(0);
  const [focus, setFocus] = useState(false);
  const [replacementState, setReplacementState] = useState(null);

  const tokens = tokenize(value);
  const parsed = annotate(parse(tokens), ANNOTATE_CONFIG);
  const suggestions = suggest(
    parsed,
    tokens,
    selection,
    focus && (!replacementState || replacementState.value !== value),

    QUERY_LANGUAGE_DICTIONARY(DICTIONARY)
  );

  return {
    value,
    onChange: ({ target: { value } }) => setValue(value),
    onSelect: ({ target: { selectionStart } }) => setSelection(selectionStart),
    onFocus: setFocus.bind(null, true),
    onBlur: setFocus.bind(null, false),
    parsed,
    queryParsed: annotate(parse(tokenize(initialValue)), ANNOTATE_CONFIG),
    suggestions,
    submitSuggestion: (replacementText) => {
      const newValue = replaceSuggestionToken(
        value,
        parsed,
        tokens,
        selection,
        focus,
        replacementText
      );
      setValue(newValue);
      setReplacementState({
        value: newValue,
        selection,
      });
    },
  };
};
