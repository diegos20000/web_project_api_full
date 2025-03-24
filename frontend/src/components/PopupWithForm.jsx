import React from "react";
import closeButton from "../images/Close Icon.jpg";
import FormValidator from "./FormValidator";

export default function PopupWithForm(props) {
  const settings = {
    formProfile: ".popup__form",
    popupText: ".popup__input",
    popupSaveButton: ".popup__submit-btn",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
  };

  const formRef = React.useRef();

  //React.useEffect(() => {
  // const formValidator = new FormValidator(settings, formRef.current);
  // formValidator.enableValidation();
  // }, [formRef]);

  const handleClickOut = (evt) => {
    if (evt.target.classList.contains("pop-up")) {
      props.onClose();
    }
  };

  return (
      <section
          onClick={handleClickOut}
          className={`popup ${props.isOpen ? "active" : ""}`}
      >
        <div className="popup__container">
          <button className="pop-up__close-button" onClick={props.onClose}>
            <img className="popup__close" src={closeButton} alt="close icon" />
          </button>
          <div className="popup__card">
            <form
                className="popup__form"
                noValidate
                id="form-profile"
                ref={formRef}
                onSubmit={props.onSubmit}
            >
              <h3 className="popup__title">{props.title}</h3>
              {props.children}
              <button
                  className="popup__submit-btn popup__submit-btn_action_add pop-up__save-button"
                  type="submit"
              >
                {props.buttonText}
              </button>
            </form>
          </div>
        </div>
        <div className="popup__overlay" onClick={props.onClose}></div>
      </section>
  );
}
