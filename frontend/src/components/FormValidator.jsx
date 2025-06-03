class FormValidator {
  constructor(settings, formElement) {
    this.settings = settings;
    this.formElement = formElement;
    this.popupText = Array.from(
      formElement.querySelectorAll(settings.popupText)
    );
    this._submitButton = formElement.querySelector(settings.popupSaveButton);
  }

  enableValidation() {
    this.formElement.addEventListener('input', () => {
      this.validateForm();
    });
  }

  validateForm() {
    const isValid = this.isFormValid();
    this.toggleSubmitButton(isValid);
  }

  isFormValid() {
    return this.popupText.every(input => input.value.trim() !== '');
  }

  toggleSubmitButton(isValid) {
    this._submitButton.disabled = !isValid;
    this._submitButton.classList.toggle(this.settings.inactiveButtonClass, !isValid);
  }


}
export default FormValidator;
