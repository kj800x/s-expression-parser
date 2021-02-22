import React from "react";
import styled from "styled-components";
import { useSuggest } from "./useSuggest";
import { TITLES, AUTHORS, INGREDIENTS, SITES, TAGS } from "./sampleData";
import { Suggestions } from "./Suggestions";
import { asTextNodes } from "s-exp-parser/util";

const PageHeader = styled.div`
  display: flex;
  height: 2em;
  padding: 0.5em;

  border-bottom: 1px solid grey;
  background: white;
`;
const QueryContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;
const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  position: relative;
`;

const Input = styled.input`
  flex: 1;
  margin-left: 12px;
  background: white;
  color: black;
`;

const InstructionTextWrapper = styled.div`
  padding: 20px;
  font-size: larger;
  border-bottom: 1px solid black;
`;

const InstructionText = () => {
  return (
    <InstructionTextWrapper>
      A demo of my s-exp-parser library. Try using functions{" "}
      {[
        "and",
        "or",
        "not",
        "title",
        "author",
        "ingredient",
        "tag",
        "source-site",
        "rating",
      ].map((e, i, a) => (
        <span key={e}>
          <code>{e}</code>
          {i !== a.length - 1 ? ", " : ""}
        </span>
      ))}
      . If there is a matching recommendation, autosuggest will suggest valid
      values. Try typing{" "}
      <code>(and (ingredient Water) (source-site "Hello Fresh"))</code>. The
      resulting parse tree would be easy to convert into a sql query for
      querying a database.
    </InstructionTextWrapper>
  );
};

export default () => {
  const {
    value,
    onChange,
    onSelect,
    onFocus,
    onBlur,
    suggestions,
    parsed,
    submitSuggestion,
  } = useSuggest("", { TITLES, AUTHORS, INGREDIENTS, SITES, TAGS });

  return (
    <div>
      <PageHeader>
        <QueryContainer>
          <span>Query:</span>
          <InputWrapper>
            <Input
              value={value}
              onChange={onChange}
              onSelect={onSelect}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <Suggestions
              submitSuggestion={submitSuggestion}
              suggestions={suggestions}
              search={() => console.log("Run Search")}
            />
          </InputWrapper>
        </QueryContainer>
      </PageHeader>
      <InstructionText />
      <pre>
        {JSON.stringify(
          { value, suggestions, textNodes: asTextNodes(parsed), parsed },
          null,
          2
        )}
      </pre>
    </div>
  );
};
