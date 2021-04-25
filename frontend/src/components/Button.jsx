import styled from "@emotion/styled";

export const Button = styled.div`
  display: inline-block;
  padding: 10px 15px;
  border-radius: 5px;
  color: #fff;
  background-color: #000;
  text-align: center;
  font-size: 24px;
  user-select: none;
  ${props => !props.isActive && 'opacity: 0.5;'}
  &:hover {
    ${props => props.isActive ? 'opacity: 0.6;' : ''}
    cursor: pointer;
  }
`;