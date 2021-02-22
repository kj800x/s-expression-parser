const isArray = Array.isArray;

const setOption = (options) => (values) => ({ ...values, options });

const annotateFuncCall = (node, CONFIG) => {
  const [funcCall, ...args] = node;

  if (!funcCall) {
    return node;
  }

  if (CONFIG.recursiveFuncs.includes(funcCall.text)) {
    return [
      //
      setOption("FUNCS")(funcCall),
      ...args.map((arg) => annotate(arg, CONFIG)),
    ];
  }

  const config = CONFIG[funcCall.text];
  if (config != null) {
    const getValue = (i) => {
      if (Array.isArray(config)) {
        return config[i] || "UNKNOWN";
      } else {
        return config;
      }
    };

    return [
      setOption("FUNCS")(funcCall),
      ...args.map((e, i) => setOption(getValue(i))(e)),
    ];
  }

  return [
    //
    setOption("FUNCS")(funcCall),
    ...args.map(setOption("UNKNOWN")),
  ];
};

export const annotate = (node, CONFIG) => {
  if (!node) {
    return node;
  }

  if (!isArray(node)) {
    return setOption(CONFIG.defaultRoot)(node);
  }

  return annotateFuncCall(node, CONFIG);
};
