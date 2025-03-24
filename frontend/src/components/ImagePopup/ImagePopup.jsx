import React from "react";
import closeButton from "../../images/Close Icon.jpg";

export default function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup__image ${card ? "active" : ""}`}>
      <div className="popup__image-container">
        <button
          className="popup-image__close"
          id="popup__close_img"
          onClick={onClose}
        >
          <img src={closeButton} alt="Pop up close icon" />
        </button>
        <div className="popup__image-content">
          {card && (
            <>
              <img
                className="popup__large-image"
                src={card.link}
                alt={`Imagen de ${card.name}`}
              />{" "}
              <h3 className="popup_title-img">{card.name}</h3>
            </>
          )}
        </div>
        <div className="popup__overlay"></div>
      </div>
    </div>
  );
}
