const parseHelper = (tokens, i) => {
  const out = [];
  while (tokens[i] && tokens[i].text !== ")") {
    if (tokens[i].text === "(") {
      const recursiveResult = parseHelper(tokens, i + 1);
      out.push(recursiveResult[0]);
      i = recursiveResult[1];
    } else {
      out.push(tokens[i]);
    }
    i++;
  }
  return [out, i];
};

export const parse = (tokens) => {
  return [
    {
      text: "__IMPLICIT__",
      start: -1,
      end: -1,
    },
    ...parseHelper(tokens, 0)[0],
  ];
};
