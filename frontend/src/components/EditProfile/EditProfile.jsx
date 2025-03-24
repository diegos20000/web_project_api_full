import React, { useState, useContext, useEffect } from "react";
import PopupWithForm from "../PopupWithForm";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function EditProfile({ onClose, isOpen, onUpdateUser }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("guardar");
  const currentUser = useContext(CurrentUserContext);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onClose();
    const defaultSubmitText = buttonText;
    setButtonText("Guardando...");

    onUpdateUser({
      name,
      about: description,
    });
  }

  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name || "");
      setDescription(currentUser.about || "");
    }
  }, [isOpen, currentUser]);

  return (
    <PopupWithForm
      title="Edit profile"
      name="edit"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={buttonText}
    >
      <fieldset className="popup__card">
        <input
          className="popup__input popup__text_title"
          type="text"
          placeholder="Nombre"
          minLength="2"
          maxLength="40"
          id="popup__input popup__input_name"
          name="name"
          required
          value={name}
          onChange={handleChangeName}
        />
        <span className="popup__input-error popup__input_name-error"> </span>
        <input
          className="popup__input popup__text_about"
          type="text"
          placeholder="Acerca de mí"
          minLength="2"
          maxLength="200"
          id="popup__input popup__input_about"
          name="about"
          required
          value={description}
          onChange={handleChangeDescription}
        />
        <span className="popup__input-error popup__input_about-error"> </span>
      </fieldset>
    </PopupWithForm>
  );
}
