import React, { useContext } from 'react'
import { Context } from "../index";
import { Popover, Button, Form, Row, Col } from "react-bootstrap"
import { useHistory } from 'react-router-dom'
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts'

const AuthTooltip = () => {
  const { user } = useContext(Context)
  const history = useHistory()

  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false);
  }

  return (

    <Popover className="auth-popover" id="popover-positioned-right"
      style={{ width: 167 }}
    >
      <div className="popover-body">
        {!user.isAuth ?
          <>
            <Button className="mb-2 w-100 auth__title auth-popover__title--fiol"
              onClick={() => history.push(REGISTRATION_ROUTE)}

            >Регистрация</Button>
            <br />
            <p style={{ whiteSpace: "nowrap" }}>

              Нет учётной записи?
            </p>
            <hr className="mt-3 mb-2" />
            <Button className="w-100 mt-1 auth-log__btn auth__title"
              onClick={() => history.push(LOGIN_ROUTE)}
            >Войти</Button>
          </>
          :
          <>
            <h5 className="auth__title auth__title--fiol">Мои данные</h5>
            <Row className="px-3" controlId="exampleForm.ControlInput1">
              <Form.Label className="font-weight-bold mr-1">Мой Email: </Form.Label>
              {/* <Form.Control className="b-0 bb" type="text" value={user.user.email} readOnly /> */}
              {' '}<p>{user.user.email}</p>
            </Row>
            <Row className="px-3" controlId="exampleForm.ControlInput1">
              <Form.Label className="font-weight-bold mr-1">Мой ник: </Form.Label>
              {/* <Form.Control className="b-0 bb" type="text" value={user.user.nickname} readOnly /> */}
              {' '}<p>{user.user.name}</p>
            </Row>
            <Row className="px-3" controlId="exampleForm.ControlInput1">
              <Form.Label className="font-weight-bold mr-1">Моя роль: </Form.Label>
              {/* <Form.Control className="b-0 bb" type="text" value={user.user.nickname} readOnly /> */}
              {' '}<p>{user.user.role}</p>
            </Row>
            <Button className="w-100 mt-1 auth-log__btn auth__title"
              onClick={logOut}
            >Выйти</Button>
          </>
        }
      </div>
    </Popover>
  );
}

export default AuthTooltip
