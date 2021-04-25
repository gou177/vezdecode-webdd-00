import styled from "@emotion/styled";
import { useEffect } from "react";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  text-align: center;
`;

export const Home = () => {
  useEffect(()=>document.title = "Ой! Произошла ошибка", []);
  return (
    <Container>
      <h1>Здесь ничего нет.</h1>
      <h2>Как вы вообще здесь оказались?...</h2>
    </Container>
  );
}