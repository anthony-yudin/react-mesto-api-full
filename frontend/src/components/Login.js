import React from 'react';

function Login({onLogin}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handlepassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onLogin(email, password);
  }

  return (
    <form className="sign" method="post" onSubmit={handleSubmit}>
      <div className="sign__body">
        <h3 className="sign__title">Вход</h3>
        <input className="sign__input" type="text" name="email" required value={email} onChange={handleChangeEmail} placeholder="Email" />
        <span className="sign__text-error" />
        <input className="sign__input" type="password" name="password" required value={password} onChange={handlepassword} placeholder="Пароль" />
        <span className="sign__text-error" />
      </div>
      <div className="sign__footer">
        <button type="submit" className="sign__btn">Войти</button>
      </div>
    </form>
  )
}

export default Login;