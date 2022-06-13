import React, { useState } from 'react'
import { Button, Form, Popover } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { deleteDevice } from '../http/deviceAPI'
import { SHOP_ROUTE } from '../utils/consts'

const DeletePostPopover = () => {
  const [id, setId] = useState('')
  const history = useHistory()

  const deleteOneDevice = () => {
    deleteDevice(id).then(data => {
      setId('')
      pushShop()
    })
  }
  const pushShop = () => {
    history.push(SHOP_ROUTE)
  }

  return (
    <div>
      <Popover
        className="type-popover delete-popover"
      >
        <div className="popover-body">
          <h5 class="mx-auto mb-2 auth__title auth__title--fiol text-center">Удалить статью по ID</h5>
          <Form>
            <Form.Control
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder={"ID статьи"}
            />
          </Form>
          <div className="mt-3">
            {/* <Button variant="outline-danger" onClick={onHide}>Закрыть</Button> */}
            <Button className="auth-log__btn auth__title" variant="outline-success" onClick={deleteOneDevice}>Удалить</Button>
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default DeletePostPopover
