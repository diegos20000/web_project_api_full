const Card = require("../models/card");

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find().populate("owner");
    res.status(200).send(cards);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener usuarios", error });
  }
};

const createCard = async (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user ? req.user._id : null;

  if (!name || !link || !owner) {
    return res.status(400).send({ message: "Faltan campos requeridos" });
  }

  try {
    const newCard = new Card({ name, link, owner });
    await newCard.save();
    res.status(201).send(newCard);
  } catch (error) {
    res.status(400).send({ message: "Error al crear la tarjeta" });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).send({ message: "Tarjeta no encontrada" });
    }
    if (card.owner.toString() !== userId.toString()) {
      return res.status(403).send({message: "No tienes permiso para borrar esta tarjeta"});
    }
    await card.remove();
    res.status(200).send({ message: "Tarjeta eliminada" });
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar la tarjeta" });
  }
};

const likeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(404).send({ message: "Tarjeta no encontrada" });
    }
    res.status(200).send(updatedCard);
  } catch (error) {
    res.status(500).send({ message: "Error al dar like a la tarjeta", error });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(404).send({ message: "Tarjeta no encontrada" });
    }
    res.status(200).send(updatedCard);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al quitar el like de la tarjeta", error });
  }
};

module.exports = { getAllCards, createCard, deleteCard, likeCard, dislikeCard };


