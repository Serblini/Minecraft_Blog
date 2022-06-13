import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";

const App = observer(() => {
  const { user } = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    check().then(data => {
      user.setUser(data)
      user.setIsAuth(true)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Spinner animation={"grow"} />
  }

  console.log(`user.isAuth`, user.isAuth)

  return (
    <BrowserRouter>
      <Header />
      <SideBar />
      <div className="fandom-community-header__background tileHorizontally header"></div>
      <div className="main-container">
        <div className="background__container"></div>
        <AppRouter />
      </div>
    </BrowserRouter>
  );
});

export default App;
