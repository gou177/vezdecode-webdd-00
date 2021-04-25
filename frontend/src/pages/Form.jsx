import styled from "@emotion/styled";
import validator from 'validator';
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  height: 800px;
`;

const MainForm = styled.form`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 550px;
  justify-content: space-between;
  @media (max-width: 400px) {
    width: 300px;
  }
`;

const Error = styled.div`
  border-radius: 10px;
  background-color: #faebeb;
  color: #e64646;
  box-sizing: border-box;
  padding: 10px;
  font-size: 18px;
  min-height: 40px;
  max-width: 400px;
  margin-bottom: 30px;
`;

const Success = styled.div`
  border-radius: 10px;
  background-color: #7dff93;
  color: #06b100;
  box-sizing: border-box;
  padding: 10px;
  font-size: 18px;
  min-height: 40px;
  max-width: 400px;
  margin-bottom: 30px;
`;

export const Form = () => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [patronymicName, setPatronymicName] = useState('');
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');
  const [isError, setError] = useState(false);
  const [sendActive, setSendActive] = useState(true);
  const [isSuccess, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState('Пожалуйста, проверьте правильность введённых данных');

  useEffect(()=>document.title = "Отправить обращение в службу поддержки", []);

  const sendForm = () => {
    if (!sendActive) return;
    setError(false);
    setSendActive(false);
    if (lastName.length < 3) {
      setSendActive(true);
      return setError(true);
    }
    if (firstName.length < 3) {
      setSendActive(true);
      return setError(true);
    }
    if (!validator.isMobilePhone(phone)) {
      setSendActive(true);
      return setError(true);
    }
    if (text.lengths < 10) {
      setSendActive(true);
      return setError(true);
    }
    fetch('/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        patronymic_name: patronymicName,
        phone: Number.parseInt(phone.replace('+', '')),
        text: text
      })
    })
      .then(data => data.json())
      .then(data => {
        if (data.success) setSuccess(true);
        else {
          setError(true);
          setSendActive(true);
          setErrorText('Произошла ошибка при отправке данных. Пожалуйста попробуйте позже.');
        }
      })
      .catch(error => {
        setError(true);
        setSendActive(true);
        setErrorText('Произошла ошибка при отправке данных. Пожалуйста попробуйте позже.');
      });
  }
  return (
    <Container>
      {isError && <Error>{errorText}</Error>}
      {isSuccess && <Success>Ваше обращение успешно отправлено!</Success>}
      <MainForm>
        <h3 style={{ textAlign: 'center' }}>Связаться со службой поддержки</h3>
        <Input placeholder="Фамилия" style={{ width: '100%' }} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <Input placeholder="Имя" style={{ width: '100%' }} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input placeholder="Отчество*" style={{ width: '100%' }} value={patronymicName} onChange={(e) => setPatronymicName(e.target.value)} />
        <Input placeholder="Номер телефона" style={{ width: '100%' }} value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Textarea placeholder="Текст обращения" style={{ width: '100%' }} value={text} onChange={(e) => setText(e.target.value)} />
        <Button onClick={sendForm} isActive={sendActive}>Отправить</Button>
      </MainForm>
    </Container>
  );
}