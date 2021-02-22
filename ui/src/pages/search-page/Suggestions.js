import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useKeys } from "../../library/hooks/useKeys";

const SuggestionWrapper = styled.li`
  background: ${({ selected }) => (selected ? "green" : "blue")};
`;

const SuggestionsWrapper = styled.ul`
  color: black;
  position: absolute;
  top: 1.5em;
  left: 0;
  background: light-blue;
  list-style-type: none;
  margin: 0;
  padding: 0;

  z-index: 1;

  & > li {
    padding: 4px 8px;
    cursor: pointer;
  }

  & > * + * {
    border-top: 1px solid white;
  }
`;

export const Suggestions = ({ suggestions, submitSuggestion, search }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);

  useEffect(() => {
    setSelectedSuggestion(0);
  }, [suggestions]);

  useKeys({
    ArrowUp: (event) => {
      setSelectedSuggestion((sug) => (sug > 0 ? sug - 1 : sug));
      event.preventDefault();
    },
    ArrowDown: (event) => {
      setSelectedSuggestion((sug) =>
        sug < suggestions.length - 1 ? sug + 1 : sug
      );
      event.preventDefault();
    },
    Tab: (event) => {
      if (suggestions.length > 0) {
        submitSuggestion(suggestions[selectedSuggestion]);
        event.preventDefault();
      }
    },
    Enter: (event) => {
      if (suggestions.length > 0) {
        submitSuggestion(suggestions[selectedSuggestion]);
        event.preventDefault();
      } else {
        search();
      }
    },
  });

  return (
    <SuggestionsWrapper>
      {suggestions.map((suggestion, i) => {
        return (
          <SuggestionWrapper
            selected={selectedSuggestion === i}
            key={suggestion}
            onMouseDown={(e) => e.preventDefault()}
            onMouseUp={() => submitSuggestion(suggestion)}
            onMouseEnter={() => {
              setSelectedSuggestion(i);
            }}
          >
            {suggestion}
          </SuggestionWrapper>
        );
      })}
    </SuggestionsWrapper>
  );
};
