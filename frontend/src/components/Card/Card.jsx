import React, { useContext } from "react";
import trashButton from "../../images/trashicons.png";

import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Card(props) {
  const { card, onCardClick, onCardLike, onCardDelete } = props;
  const currentUser = useContext(CurrentUserContext);

  if (!card) {
    return null;
  }

  const { name, link, _id, likes = [] } = card;

  const isLiked = likes.some((i) => i._id === currentUser._id);

  const CardLikeButtonClassName = `element__button-like ${
    isLiked ? "element__button-like_active" : ""
  }`;

  const cardDeleteButtonClassName = "element__button-trash";

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleCardDelete() {
    if (onCardDelete && typeof onCardDelete === "function") {
      onCardDelete(card);
    } else {
      console.error("onCardDelete is not a function");
    }
  }

  return (
    <div className="card" key={_id}>
      <button
        type="button"
        className={cardDeleteButtonClassName}
        onClick={handleCardDelete}
      >
        <img
          src={trashButton}
          alt="Botón de Eliminar"
          className="element__button-trash-img"
        />
      </button>
      <img
        src={link}
        className="element__img"
        alt={`imagen de ${name}`}
        onClick={handleClick}
      />
      <div className="element_text-like">
        <div className="element__text">
          <p className="element__name">{name}</p>
        </div>
        <button
          className={CardLikeButtonClassName}
          onClick={handleLikeClick}
        ></button>
        <p className="element__counter">{likes.length}</p>
      </div>
    </div>
  );
}
