import React from "react";
import styled from "styled-components";

const RadioGroup = ({ children, legend }) => {
  return (
    <RadioGroupFieldset>
      <RadioGroupLegend>{legend}</RadioGroupLegend>
      {children}
    </RadioGroupFieldset>
  );
};

const RadioGroupFieldset = styled.fieldset`
  padding: 1rem;
  border: 0;
`;

const RadioGroupLegend = styled.legend`
  font-size: 1rem;
`;

export default RadioGroup;