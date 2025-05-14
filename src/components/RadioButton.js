import React from "react";
import styled from "styled-components";

const RadioButton = ({ id, name, value, checked, labelText, onChange, price }) => {
  return (
    <RadioButtonWrappingLabel className="border-0">
      <RadioButtonInput
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="border-0"
      />
      <RadioFakeSpan className="d-flex justify-content-between w-100" tabIndex={0}>
        <span>{labelText}</span>
        {price && <span>{price}</span>}
      </RadioFakeSpan>
    </RadioButtonWrappingLabel>
  );
};

const RadioButtonWrappingLabel = styled.label`
  font-size: 1rem;
  padding-bottom: 0.25rem;
  display: block;
  text-wrap: nowrap;
  cursor: pointer;
`;

const RadioButtonInput = styled.input`
  border: none;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  &:focus + span {
    outline: 2px solid #2c6145;
  }
`;

const RadioFakeSpan = styled.span`
  padding: 0.25rem;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  &:before {
    content: "";
    display: inline-block;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    border: 2px solid #2c6145;
    margin-right: 0.75em;
    transition: 0.2s;
    background: #fff;
    box-sizing: border-box;
  }
  ${RadioButtonInput}:checked + &::before {
    background: #2c6145;
    box-shadow: 0 0 0 4px #e8f5e9;
    border-color: #2c6145;
  }
`;

export default RadioButton;