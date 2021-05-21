import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import * as Auth from './Auth.js';

function Register({onRegister}) {
  let history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handlepassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault()

    onRegister(email, password);
  }

  return (
    <form className="sign" method="post" onSubmit={handleSubmit}>
      <div className="sign__body">
        <h3 className="sign__title">Регистрация</h3>
        <input className="sign__input" type="text" name="email" value={email} onChange={handleChangeEmail} required placeholder="Email" />
        <span className="sign__text-error" />
        <input className="sign__input" type="password" name="about"  required value={password} onChange={handlepassword} placeholder="Пароль" />
        <span className="sign__text-error" />
      </div>
      <div className="sign__footer">
        <button type="submit" className="sign__btn">Зарегистрироваться</button>
        <p className="sign__signature">Уже зарегистрированы? <Link to="/sign-in" className="sign__href">Войти</Link></p>
      </div>
    </form>
  )
}

export default Register;
