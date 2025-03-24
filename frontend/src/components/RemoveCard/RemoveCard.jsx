import React from "react";

export default function RemoveCard(onClose) {
  return (
    <div className="pop-up__container">
      <button className="pop-up__close-button">
        <img src="./images/Close Icon.jpg" alt="Pop up close icon" />
      </button>
      <form className="pop-up__form">
        <h3 className="pop-up__title pop-up__delete-title">¿Estás seguro/a?</h3>
        <input type="hidden" name="cardId" class="popup__input" />
        <button className="pop-up__save-button" type="submit">
          Sí
        </button>
      </form>
    </div>
  );
}
