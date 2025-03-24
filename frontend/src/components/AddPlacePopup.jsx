import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({ isOpen, onClose, onAddPlaceSubmit }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [buttonText, setbuttonText] = useState("Guardar");

  function handleChangeTitle(e) {
    setTitle(e.target.value);
  }

  function handleChangeLink(e) {
    setLink(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const defaultSubmitText = buttonText;
    setbuttonText("Guardando...");

    await onAddPlaceSubmit({
      name: title,
      link,
    });

    setbuttonText(defaultSubmitText);
  }

  useEffect(() => {
    setTitle("");
    setLink("");
  }, [isOpen]);

  return (
    <PopupWithForm
      title="Nuevo Lugar"
      name="popup__Card"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={buttonText}
    >
      <fieldset className="popup__card">
        <input
          className="popup__input popup__input_title"
          type="text"
          placeholder="Title"
          name="title"
          id="input__card_title"
          minLength="2"
          maxLength="30"
          value={title}
          onChange={handleChangeTitle}
          required
        />
        <span className="popup__input-error input__card_title-error"> </span>
        <input
          className="popup__input popup__input_url"
          type="url"
          placeholder="Image URL"
          name="link"
          id="input__card_link"
          minLength="2"
          maxLength="200"
          value={link}
          onChange={handleChangeLink}
          required
        />
        <span className="popup__input-error input__card_link-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}
