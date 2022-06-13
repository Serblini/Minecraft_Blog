import React, { useContext, useState } from 'react';
import { Container, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Auth = observer(() => {
  const { user } = useContext(Context)
  const location = useLocation()
  const history = useHistory()
  const isLogin = location.pathname === LOGIN_ROUTE
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, name, password);
      } else {
        data = await registration(email, name, password);
      }
      user.setUser(data)
      console.log(`user.user: ${user.user}`)
      user.setIsAuth(true)
      console.log(`user.isAuth`, user.isAuth)
      history.push(SHOP_ROUTE)
    } catch (e) {
      alert(e.response.data.message)
    }
    console.log(`Регистрация прошла успешно!`);
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ minWidth: 300, maxWidth: 450 }} className="p-5 border-0">
        <h2 className="m-auto auth__title auth__title--fiol">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3 b-0 bb"
            placeholder="Электронная почта"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3 b-0 bb"
            placeholder="Имя участника"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Form.Control
            className="my-3 b-0 bb"
            placeholder="Введите ваш пароль..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
          {/* <Row className="d-flex justify-content-between mt-3 pl-3 pr-3"> */}
          {isLogin ?
            <div>
              Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
            </div>
            :
            <div>
              Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
            </div>
          }
          <Button
            // variant={"outline-success"}
            className="mt-3 auth-log__btn auth__title"
            onClick={click}
          >
            {isLogin ? 'Войти' : 'Регистрация'}
          </Button>
          {/* </Row> */}

        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
