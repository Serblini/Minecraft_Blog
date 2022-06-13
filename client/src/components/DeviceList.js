import React, { useState, useEffect, useContext, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Row, Col, Form } from "react-bootstrap";
import DeviceItem from "./DeviceItem";
import "./DeviceList.css";

const DeviceList = observer(() => {
  const { device } = useContext(Context);

  const formEl = useRef();

  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (formEl && formEl.current) {
      formEl.current.addEventListener("keydown", clearClickEnter);
    }
  }, []);

  const clearClickEnter = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  //    Сортировка
  const filteredItems = device.devices.filter((device) => {
    return device.name.toLowerCase().includes(value.toLowerCase());
  });

  const itemClickHandler = (e) => {
    setValue(e.target.textContent);
    setIsOpen(!isOpen);
  };

  const inputClickHandler = () => [setIsOpen(true)];

  return (
    <Col>
      <Form className="search_form">
        <Form.Control
          type="text"
          placeholder="Введите что-либо"
          className="search_input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onClick={inputClickHandler}
          // onSubmit={() => false}
          ref={formEl}
        ></Form.Control>
        {/* <Form.Check type="switch" id="custom-switch" label="Поиск по авторам" /> */}
        <ul className="autocomplete">
          {value &&
            isOpen &&
            filteredItems.map((device) => {
              return (
                <li className="autocomplete_item" onClick={itemClickHandler}>
                  {device.name}
                </li>
              );
            })}
        </ul>
      </Form>

      <Row xs={1} md={1} className="g-4">
        {filteredItems.map((device) => (
          <DeviceItem key={device.id} device={device} />
        ))}
        {device.brands
          .filter((brand) => brand.typeid === 1)
          .map((brand) => (
            <Col
              style={{ cursor: "pointer" }}
              key={brand.id}
              className="p-3"
              onClick={() => device.setSelectedBrand(brand)}
              border={brand.id === device.selectedBrand.id ? "danger" : "light"}
            >
              {brand.name}
            </Col>
          ))}
      </Row>
    </Col>
  );
});

export default DeviceList;
