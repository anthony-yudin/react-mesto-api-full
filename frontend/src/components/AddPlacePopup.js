import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({handleClickClose, isOpen, onClose, onAddPlace, buttonText}) {
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleLinkName(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({ name, link });
  }

  return (
    <PopupWithForm handleClickClose={handleClickClose} onClose={onClose} isOpen={isOpen} buttonText={buttonText} name="add-cards" title="Новое место" onSubmit={handleSubmit}>
      <input className="popup__input popup__input_value_name-cards" type="text" name="name"
             placeholder="Название" required minLength="2" maxLength="30" value={name} onChange={handleChangeName} />
      <span className="popup__text-error"/>
      <input className="popup__input popup__input_value_link-cards" type="url" name="link"
             placeholder="Ссылка на картинку" required value={link} onChange={handleLinkName} />
      <span className="popup__text-error"/>
    </PopupWithForm>
  )
}

export default AddPlacePopup;