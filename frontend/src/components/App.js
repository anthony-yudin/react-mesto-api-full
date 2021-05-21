import React from 'react';
import Header from './Header';
import Main from './Main';

import ImagePopup from "./ImagePopup";
import { Route, Switch, Redirect } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardsContext } from '../contexts/CardsContext';
import api from '../utils/api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeletePopup from './DeletePopup';
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import * as Auth from './Auth.js';
import { useHistory } from 'react-router-dom';
import InfoTooltip from './InfoTooltip';


function App() {
  let history = useHistory();

  // Установка стейтов попапов
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isDeletePlacePopupOpen, setDeletePlacePopupOpen] = React.useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
  const [isInfoTooltipPopupSuccess, setInfoTooltipPopupSuccess] = React.useState(false);

  const [idCard, setIdCard] = React.useState();
  const [loggedIn, setLoggedIn] = React.useState(false);

  // Установка стейта попапа для картинки в карточке
  const [selectedCard, setSelectedCard] = React.useState(false);

  // Установка стейтов карточек и пользователя
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState({});
  const [email, setEmail] = React.useState();

  React.useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  React.useEffect(() => {
    api.initialPage()
      .then(([getUserInfo, getCardList]) => {
        setCurrentUser(getUserInfo);
        setCards(getCardList);
      })
      .catch(err => console.log(err));
  }, []);

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');

    if (jwt){
      Auth.getContent(jwt).then((res) => {
        if (res) {
          setEmail(res.data.email);

          setLoggedIn(true);
          history.push("/");
        }
      });
    }
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, isLiked).then(newCard => {
      setCards((state) => state.map((currentCard) => currentCard._id === card._id ? newCard : currentCard));
    })
      .catch(err => console.log(err));
  }

  function handleUpdateUser(data) {
    api.setUserInfo(data).then(data => setCurrentUser(data))
      .then(() => closeAllPopups())
      .catch(err => console.log(err));
  }

  function handleUpdateAvatar(data) {
    api.updateAvatar(data).then(data => setCurrentUser(data))
      .then(() => closeAllPopups())
      .catch(err => console.log(err));
  }

  function handleAddPlaceSubmit(data) {
    api.sendCard(data).then(data => setCards([data, ...cards]))
      .then(() => closeAllPopups())
      .catch(err => console.log(err));
  }

  function handleCardDelete(id) {
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.deleteCard(id)
      .then(() => {
        setCards((state) => state.filter((currentCard) => currentCard._id !== id));
      })
      .then(() => closeAllPopups())
      .catch(err => console.log(err));
  }

  function onCardId(id) {
    setIdCard(id);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function onCardDeletePopup() {
    setDeletePlacePopupOpen(!isDeletePlacePopupOpen);
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(false);
    setDeletePlacePopupOpen(false);
    setInfoTooltipPopupOpen(false);
  }

  function handleClickClose(evt) {
    const evtTarget = evt.target;

    if (evtTarget.classList.contains('popup') || evtTarget.classList.contains('popup__close')) {
      closeAllPopups();
    }
  }

  function onRegister(email, password) {
    Auth.register(password, email)
      .then((res) => {
        if (res) {
          console.log('Регистрация прошла успешно!');

          setInfoTooltipPopupSuccess(true);
          history.push('/sign-in');
        } else {
          setInfoTooltipPopupSuccess(false);
          console.error('Что-то пошло не так!');
        }
        setInfoTooltipPopupOpen(true);
      });
  }

  function onLogin(email, password) {
    if (!email || !password){
      return;
    }
    Auth.authorize(email, password)
      .then((data) => {
        if (data){
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch(err => console.log(err));
  }

  function onSignOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardsContext.Provider value={cards}>
        <div className="page__content">
          <div className="container">
            <Header email={email} loggedIn={loggedIn} onSignOut={onSignOut}/>
            <Switch>
              <ProtectedRoute
                exact
                path="/"
                loggedIn={loggedIn}
                component={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDeletePopup={onCardDeletePopup}
                onCardId={onCardId}
              />

              <Route path="/sign-up">
                <Register onRegister={onRegister} />
              </Route>

              <Route path="/sign-in">
                <Login onLogin={onLogin}/>
              </Route>
              <Route>
                {loggedIn ? (
                  <Redirect to="/" />
                ) : (
                  <Redirect to="/sign-in" />
                )}
              </Route>
            </Switch>
          </div>

          <ImagePopup card={selectedCard} onClose={closeAllPopups} handleClickClose={handleClickClose} />

          <EditProfilePopup handleClickClose={handleClickClose} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} buttonText={'Сохранить'} />

          <EditAvatarPopup handleClickClose={handleClickClose} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} buttonText={'Сохранить'} />

          <AddPlacePopup handleClickClose={handleClickClose} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} buttonText={'Создать'} />

          <DeletePopup handleClickClose={handleClickClose} isOpen={isDeletePlacePopupOpen} onClose={closeAllPopups} onDelete={handleCardDelete} idCard={idCard} buttonText={'Да'} />

          <InfoTooltip isInfoTooltipPopupSuccess={isInfoTooltipPopupSuccess} handleClickClose={handleClickClose} isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} />
        </div>
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
