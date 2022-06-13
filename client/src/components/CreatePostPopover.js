import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { Popover, Button, Row, Col, Form, Dropdown } from 'react-bootstrap'
// import PopoverBody from 'react-bootstrap/PopoverBody'
import { Context } from "../index";
import { createDevice, fetchTypes } from "../http/deviceAPI";
import { SHOP_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';


const CreatePostPopover = observer(() => {
  const { device, user } = useContext(Context)
  const history = useHistory()
  const [name, setName] = useState('')
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null)
  // const [info, setInfo] = useState([])

  // useEffect(() => {
  //   // fetchBrands().then(data => device.setBrands(data))
  // }, [])

  const loadTypes = () => {
    fetchTypes().then(data => device.setTypes(data))
  }

  // const addInfo = () => {
  //   setInfo([...info, { title: '', description: '', number: Date.now() }])
  // }
  // const removeInfo = (number) => {
  //   setInfo(info.filter(i => i.number !== number))
  // }
  // const changeInfo = (key, value, number) => {
  //   setInfo(info.map(i => i.number === number ? { ...i, [key]: value } : i))
  // }

  const selectFile = e => {
    setFile(e.target.files[0])
  }

  const pushShop = () => {
    history.push(SHOP_ROUTE)
  }

  const addDevice = () => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('img', file)
    //brandId липовый, на сервере по нику всё равно делается
    formData.append('brandId', 1)
    formData.append('nickname', user.user.name)
    formData.append('typeId', device.selectedType.id)
    // formData.append('info', JSON.stringify(info))
    createDevice(formData).then(data => pushShop)
  }

  console.log(`Рендеринг`)
  console.log(`user: ${JSON.stringify(user.user, null, 2)}`)

  return (
    <Popover
      className="post-popover"
      id="popover-contained"
    >
      {/* <div className="post-popover popover bs-popover-right"> */}
      <div className="popover-body">
        <h5 class="m-auto auth__title auth__title--fiol text-center">Добавить пост</h5>
        <Form>
          <Dropdown className="mt-2 mb-2"
            onClick={loadTypes}
          >
            <Dropdown.Toggle className="auth-log__btn auth__title">{device.selectedType.name || "Категория статьи"}</Dropdown.Toggle>
            <Dropdown.Menu>
              {device.types.map(type =>
                <Dropdown.Item
                  onClick={() => device.setSelectedType(type)}
                  key={type.id}
                >
                  {type.name}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Form.Control
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-3 bb b-0"
            placeholder="Заголовок статьи"
          />
          <Form.Control
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-3 bb b-0"
            as="textarea"
            placeholder="Текст статьи"
            style={{ height: '150px' }}
          />
          <Form.Control
            className="mt-3"
            type="file"
            onChange={selectFile}
          />
          <hr />
          {/* <Button
            className="auth__title"
            variant={"outline-dark"}
            onClick={addInfo}
          >
            Добавить новое свойство
          </Button> */}

        </Form>
        <div className="mt-3">
          {/* <Button className="mr-2 auth__title auth-popover__title--fiol" variant="outline-danger" onClick={pushShop}>Закрыть</Button> */}
          <Button className="auth-log__btn auth__title" variant="outline-success" onClick={addDevice}>Добавить</Button>
        </div>
      </div>
    </Popover>
  );
});

export default CreatePostPopover
