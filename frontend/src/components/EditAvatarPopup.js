import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({handleClickClose, isOpen, closeAllPopups, onUpdateAvatar, buttonText}) {
  const avatar = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatar.current.value,
    });
  }

  return(
    <PopupWithForm handleClickClose={handleClickClose} onClose={closeAllPopups} isOpen={isOpen} buttonText={buttonText} name="update-avatar" title="Обновить аватар" onSubmit={handleSubmit}>
      <input className="popup__input popup__input_value_link-avatar" type="url" name="avatar"
             placeholder="Ссылка на картинку" required ref={avatar} />
      <span className="popup__text-error"/>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;