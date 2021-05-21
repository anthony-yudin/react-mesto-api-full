import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardsContext } from '../contexts/CardsContext';
import Footer from './Footer';

function Main({onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDeletePopup, onCardId}) {
  const currentUser = React.useContext(CurrentUserContext);
  const cards = React.useContext(CardsContext);

  return (
    <>
      <main className="main">
        {currentUser && cards &&
          <>
          <section className="profile">
            <div className="profile__info">
              <div className="profile__img-box" onClick={onEditAvatar}>
                <div className="profile__img" style={{backgroundImage: `url(${currentUser.avatar})`}}/>
              </div>
              <div className="profile__content">
                <div className="profile__fio-box">
                  <h1 className="profile__fio">{currentUser.name}</h1>
                  <button type="button" className="profile__edit" onClick={onEditProfile}/>
                </div>
                <p className="profile__about">{currentUser.about}</p>
              </div>
            </div>
            <button type="button" className="profile__add" onClick={onAddPlace}/>
          </section>
          <section className="cards">
            {Array.from(cards).map(card => {
              return (
                <Card card={card}
                      onCardClick={onCardClick}
                      onCardLike={onCardLike}
                      onCardDeletePopup={onCardDeletePopup}
                      onCardId={onCardId}
                      key={card._id} />
              )
            })}
          </section>
          </>
        }
      </main>
      <Footer />
    </>
  )
}
export default Main