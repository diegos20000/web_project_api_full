import React, { useEffect, useRef, useState } from "react";
import avatarImage from "../../images/explorer.jpg";

import PopupWithForm from "../PopupWithForm";

export default function EditAvatar({ onClose, isOpen, onUpdateAvatar }) {
  const avatarRef = useRef();
  const [buttonText, setButtonText] = useState("Guardar");

  async function handleSubmit(e) {
    e.preventDefault();
    setButtonText("Guardando...");

    const url = avatarRef.current.value;
    console.log("Avatar URL:", url);

    if (!url || !url.startsWith('http')) {
      console.error('Invalid URL:', url);
      setButtonText("Guardar");
      return;
    }

    await onUpdateAvatar({ avatar: url });
    setButtonText("Guardar");
  }

  useEffect(() => {
    avatarRef.current.value = "";
    setButtonText("Guardar");
  }, [isOpen]);

  return (
    <PopupWithForm
      title="Cambiar foto de perfil"
      name="profile__img"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={buttonText}
      className="avatar-popup"
    >
      <fieldset className="profile__img">
        <input
          className="pop-up__form-item pop-up__form-item-about popup__input-avatar"
          type="url"
          placeholder="URL"
          id="link"
          name="link"
          ref={avatarRef}
          required
        />
        <span className="pop-up__form-error pop-up__form-error_link"></span>
      </fieldset>
    </PopupWithForm>
  );
}
