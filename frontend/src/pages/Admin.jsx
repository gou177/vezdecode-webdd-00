import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Table } from "../components/Table";

const Container = styled.div`
  box-sizing: border-box;
  padding: 20px 0 0 10px;
`;

export const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  useEffect(()=>document.title = "Админ панель", []);
  useEffect(()=>{
    fetch('/forms')
    .then(data => data.json())
    .then(data => {
      setData(data);
      setLoading(false)
    });
  }, []);
  return (
    <Container>
      <h2>Обращения пользователей</h2>
      {loading ? <p style={{marginTop: 10}}>Загрузка...</p> : <Table tableData={data}/>}
    </Container>
  );
}