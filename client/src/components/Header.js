import React, { useContext, useEffect } from 'react';
import { Context } from "../index";
import { NavLink, Link } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { Container, Navbar, Nav } from "react-bootstrap";

import logo from '../assets/logo.png'
import { fetchTypes } from '../http/deviceAPI';

const Header = observer(() => {
  const { device } = useContext(Context)

  useEffect(() => {
    fetchTypes().then(data => device.setTypes(data))
  }, [])

  return (
    <Navbar bg="dark" variant="dark" className="fandom-sticky-header">
      <Container>
        <Nav className="mr-3 d-flex align-items-center"
          active={Object.entries(device.selectedType).length === 0}
          onClick={() => device.setSelectedType({})}
        >
          <NavLink to={SHOP_ROUTE} className="fandom-sticky-header__logo">
            <img src={logo} width="320" height="264" alt="Minecraft Wiki" />
          </NavLink>
          <NavLink to={SHOP_ROUTE} className="header-types fandom-sticky-header__sitename text-white">Minecraft Blog</NavLink>
        </Nav>
        <Nav
          className="mr-auto"
        >
          {/* <ListGroup horizontal> */}
          {device.types.map(type =>
            <Link
              to={SHOP_ROUTE}
              className="header-types mr-2 text-white"
              style={{ cursor: 'pointer' }}
              active={type.id === device.selectedType.id}
              onClick={() => device.setSelectedType(type)}
              key={type.id}
            >
              {type.name}
            </Link>
          )}
          {/* </ListGroup> */}
        </Nav>
      </Container>
    </Navbar>

  );
});

export default Header;
