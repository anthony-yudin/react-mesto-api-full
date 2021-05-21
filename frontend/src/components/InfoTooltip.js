import React from 'react';
import PopupWithForm from './PopupWithForm';

function InfoTooltip({handleClickClose, isOpen, onClose, isInfoTooltipPopupSuccess}) {
  return (


    <PopupWithForm handleClickClose={handleClickClose} isOpen={isOpen} onClose={onClose}>
      <div className="popup__form-message">

        {!isInfoTooltipPopupSuccess ? (
            <>
              <div className="popup__form-message-img"/>
              <div className="popup__form-message-text">
                Что-то пошло не так!
                Попробуйте ещё раз.
              </div>
            </>
          ) :
          (
            <>
              <div className="popup__form-message-img popup__form-message-img_success"/>
              <div className="popup__form-message-text">
                Вы успешно зарегистрировались!
              </div>
            </>
          )
        }


      </div>
    </PopupWithForm>
  )
}

export default InfoTooltip;