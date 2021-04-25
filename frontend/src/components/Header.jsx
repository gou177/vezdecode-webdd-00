import styled from "@emotion/styled";

const HeaderComponent = styled.div`
  height: 50px;
  background-color: #000;
  @media (min-width: 700px) {
    height: 80px;
  }
`;

const Logo = styled.h1`
  color: #fff;
  margin: 5px 0 0 10px;
  @media (min-width: 700px) {
    margin: 20px 0 0 20px;
  }
`;


export const Header = () => <HeaderComponent>
  <Logo>LOGO</Logo>
</HeaderComponent>