import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Form, Button, Popover } from "react-bootstrap";
import { createType } from "../http/deviceAPI";
import { SHOP_ROUTE } from '../utils/consts';

const CreateType = ({ show, onHide }) => {
  const [value, setValue] = useState('')
  const history = useHistory()

  const addType = () => {
    createType({ name: value }).then(data => {
      setValue('')
      pushShop()
    })
  }
  const pushShop = () => {
    history.push(SHOP_ROUTE)
  }

  return (
    <Popover
      className="type-popover"
    >
      <div className="popover-body">
        <h5 class="mx-auto mb-2 auth__title auth__title--fiol text-center">Добавить категорию</h5>
        <Form>
          <Form.Control
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={"Название категории"}
          />
        </Form>
        <div className="mt-3">
          {/* <Button variant="outline-danger" onClick={onHide}>Закрыть</Button> */}
          <Button className="auth-log__btn auth__title" variant="outline-success" onClick={addType}>Добавить</Button>
        </div>
      </div>
    </Popover>
  );
};

export default CreateType;
