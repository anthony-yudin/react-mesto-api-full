import React from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Card({card, onCardClick, onCardLike, onCardDeletePopup, onCardId}) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  const isLikedClass = (
    `${isLiked ? 'card__like card__like_active' : 'card__like'}`
  );

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleClick() {
    onCardClick(card);
  }

  function handleDelete() {
    onCardDeletePopup();
    onCardId(card._id);
  }

  return (
    <article className="card" id={card._id}>
      <div className="card__img" onClick={handleClick} style={{backgroundImage: `url(${card.link})`}}/>
      <div className="card__content">
        <h3 className="card__title">{card.name}</h3>
        <div className="card__like-info">
          <button type="button" className={isLikedClass} onClick={handleLikeClick}/>
          <div className="card__like-count">{card.likes.length}</div>
        </div>
      </div>
      {isOwn && <div className="card__delete" onClick={handleDelete} />}
    </article>
  )
}

export default Card