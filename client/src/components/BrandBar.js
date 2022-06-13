import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Card, Row, Accordion, ListGroup } from "react-bootstrap";

const BrandBar = observer(() => {
  const { device } = useContext(Context);

  return (
    <>
      {/* <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Авторы статей</Accordion.Header>
          <Accordion.Body className="p-0">
            <ListGroup className="my-2">
              <ListGroup.Item
                className="py-2 px-1"
                style={{ cursor: 'pointer' }}
                active={Object.entries(device.selectedBrand).length === 0}
                onClick={() => device.setSelectedBrand({})}
                key={'unical'}
              >
                По-умолчанию
              </ListGroup.Item>
              {device.brands.map(brand =>
                <ListGroup.Item
                  style={{ cursor: 'pointer' }}
                  key={brand.id}
                  className="py-2 px-1"
                  onClick={() => device.setSelectedBrand(brand)}
                  active={brand.id === device.selectedBrand.id}
                >
                  {brand.name}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion> */}
      {/* <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Авторы статей</Accordion.Header>
          <Accordion.Body> */}

      <Row className="px-4">
        {/* <h2 className="auth__title auth__title--fiol">Авторы статей</h2> */}
        <ListGroup className="my-2 mr-auto" horizontal>
          <ListGroup.Item
            className="py-2 px-1 auth__title"
            style={{ cursor: "pointer" }}
            active={Object.entries(device.selectedBrand).length === 0}
            onClick={() => device.setSelectedBrand({})}
            key={"unical"}
          >
            Все авторы
          </ListGroup.Item>
          {device.brands.map((brand) => (
            <ListGroup.Item
              style={{ cursor: "pointer" }}
              key={brand.id}
              className="py-2 px-1 auth__title"
              onClick={() => device.setSelectedBrand(brand)}
              active={brand.id === device.selectedBrand.id}
            >
              {brand.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
      {/* </Accordion.Body>
        </Accordion.Item>
      </Accordion> */}
    </>
  );
});

export default BrandBar;
