import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";

export default function ConfirmDeletePopup({
  isOpen,
  onClose,
  onConfirmDelete,
}) {
  const [buttonText, setButtonText] = useState("Eliminar");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Delete button clicked");

    setIsLoading(true);
    setButtonText("Eliminando...");

    try {
      await onConfirmDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting card:", error);
    } finally {
      setIsLoading(false);
      setButtonText("Eliminar");
    }
  }

  return (
    <PopupWithForm
      name="popUp-Delete"
      title="¿Estás seguro/a?"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={isLoading ? "Eliminando..." : buttonText}
      skipValidation={true}
    ></PopupWithForm>
  );
}
