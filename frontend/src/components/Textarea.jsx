import styled from "@emotion/styled";

export const Textarea = styled.textarea`
  font-size: 18px;
  border-radius: 10px;
  border: 1px solid #000;
  height: 200px;
  resize: none;
  padding: 5px 0 0 10px;
  box-sizing: border-box;
  &:focus {
    outline: none;
  }
`;