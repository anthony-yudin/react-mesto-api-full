import React from 'react';
import logo from '../images/logo.svg';
import { Link, useLocation } from "react-router-dom";

function Header(props) {
  const location = useLocation();

  function signOut() {
    props.onSignOut();
  }

  return (
    <header className="header">
      <Link to="/">
        <img className="header__logo" src={logo} alt="Место"/>
      </Link>
      {props.loggedIn ? <div className="header__right"><span className="header__href">{props.email}</span><span className="header__exit" onClick={signOut}>Выйти</span></div> :
        location.pathname === '/sign-up' ? <Link className="header__href" to="/sign-in">Войти</Link> :
          <Link className="header__href" to="/sign-up">Регистрация</Link>  }
    </header>
  )
}
export default Header