import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({ handleClickClose, isOpen, onClose, onUpdateUser, buttonText }) {
  const [name, setName] = React.useState('');
  const [about, setAbout] = React.useState('');
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeAbout(e) {
    setAbout(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({ name, about });
  }

  return (
    <PopupWithForm onSubmit={handleSubmit} onClose={onClose} isOpen={isOpen} handleClickClose={handleClickClose} buttonText={buttonText} name="edit-profile" title="Редактировать профиль">
      <input className="popup__input popup__input_value_fio" type="text" name="name" required minLength="2"
             maxLength="40" value={name} onChange={handleChangeName} />
      <span className="popup__text-error" />
      <input className="popup__input popup__input_value_profess" type="text" name="about" required minLength="2"
             maxLength="200" value={about} onChange={handleChangeAbout} />
      <span className="popup__text-error" />
    </PopupWithForm>
  )
}

export default EditProfilePopup