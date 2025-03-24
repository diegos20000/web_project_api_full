class FormValidator {
  constructor(settings, formElement) {
    this.settings = settings;
    this.formElement = formElement;
    this.popupText = Array.from(
      formElement.querySelectorAll(settings.popupText)
    );
    this._submitButton = formElement.querySelector(settings.popupSaveButton);
  }
}
export default FormValidator;
