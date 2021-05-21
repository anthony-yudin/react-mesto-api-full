import React from 'react';
import PopupWithForm from './PopupWithForm';

function DeletePopup({handleClickClose, isOpen, onClose, onDelete, idCard, buttonText}) {

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onDelete(idCard);
  }

  return (
    <PopupWithForm onSubmit={handleSubmit} handleClickClose={handleClickClose} isOpen={isOpen} onClose={onClose} buttonText={buttonText} name="delete-confirm" title="Вы уверены?">
    </PopupWithForm>
  )
}

export default DeletePopup;