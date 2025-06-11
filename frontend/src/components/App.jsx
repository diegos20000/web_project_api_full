import React, { useState, useEffect } from "react";
import Header from "./Header/Header.jsx";
import Main from "./Main.jsx";
import Card from "../components/Card/Card.jsx";
import ConfirmDeletePopup from "./ConfirmDeletePopup.jsx";
import ImagePopup from "./ImagePopup/ImagePopup.jsx";
import EditProfile from "./EditProfile/EditProfile.jsx";
import EditAvatar from "./Avatar/EditAvatar.jsx";
import AddPlacePopup from "./AddPlacePopup.jsx";
import Footer from "./Footer/Footer.jsx";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";
import "../../index.css";
import { setToken, getToken } from "../utils/token.js";
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import InfoTooltip from './InfoTooltip.jsx';
import auth from "../utils/auth.js";
import api from "../utils/api.js";

import checkImage from "../images/check.png";
import errorImage from "../images/x.png";

const BASE_URL = "http://localhost:5000";


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  //const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tooltipLogo, setTooltipLogo] = useState('');
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);



  useEffect(() => {
    const jwt = localStorage.getItem("authToken");

    if (jwt) {
      getUserInfo()
        .then(userInfo => {
          setIsLoggedIn(true);
          setCurrentUser(userInfo);
          navigate("/");
        })
        .catch(() => {
          localStorage.removeItem("authToken");
        });
    }

    const handleEscKey = (evt) => {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleDeletePopupClick(card) {
    setCardToDelete(card);
    setIsDeletePopupOpen(true);
  }

  function handleCardLike(card) {
    const likes = Array.isArray(card.likes) ? card.likes : [];
    const isLiked = likes.some((i) => i.toString() === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((updatedCard) => {
        setCards((prevCards) =>
          prevCards.map((c) => (c._id === updatedCard._id ? updatedCard : c))

        );

      })
      .catch((error) => {
        console.error("Error al cambiar el estado del like:", error);
      });
  }


  async function handleCardDelete() {
    console.log("Delete confirmation received for card:", cardToDelete);

    if (!cardToDelete) {
      console.error("No card selected for deletion.");
      return;
    }

    try {
      console.log("Attempting to delete card:", cardToDelete._id);
      await api.deleteCard(cardToDelete._id);

      setCards((prevCards) =>
        prevCards.filter((card) => card._id !== cardToDelete._id));
      setCardToDelete(null);
      setIsDeletePopupOpen(false);
    } catch (error) {
      console.error("Error deleting card:", error);
    }

  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  async function handleAddPlaceSubmit({ link, name }) {

    try {
      const newCard = await api.createCard(link, name);
      console.log("Nueva tarjeta creada:", newCard);
      setCards((prevCards) => [newCard, ...prevCards]);
      closeAllPopups();
    } catch (error) {
      console.error("Error al crear la tarjeta:", error);
    }
  }


  function handleCardClick(card) {
    setSelectedCard(card);
  }

  const handleUpdateAvatar = async (data) => {
    const token = getToken();


    if (!token) {
      console.error("No token found. User may not be logged in.");
      return;
    }

    try {

      const response = await fetch(`${BASE_URL}/users/me/avatar`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log("Response Status:", response.status);

      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser((prevState) => ({
          ...prevState,
          avatar: updatedUser.avatar,
        }));
        closeAllPopups();
      } else {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error("Error al actualizar avatar");
      }
    } catch (error) {

    }
  };

  function onUpdateUser(user) {
    setCurrentUser(user);
    closeAllPopups();
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsDeletePopupOpen(false);
  }



  const getUserInfo = async () => {
    try {
      const userInfo = await auth.getUserInfo();
      return userInfo;
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
      throw error;
    }
  };



  const handleSignup = async (email, password) => {

    try {
      const registeredEmails = JSON.parse
        (localStorage.getItem("registeredEmails")) || [];
      const result = await auth.register(email, password);

      if (result.token) {
        setToken(result.token);
      }

      registeredEmails.push(email);
      localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));


      setTooltipMessage("¡Correcto! Ya estás registrado.");
      setTooltipLogo(checkImage);
      setInfoTooltipOpen(true);
      setIsLoggedIn(true);
    } catch (error) {
      setTooltipMessage("Uy, algo salió mal. Por favor, inténtalo de nuevo.");
      setTooltipLogo(errorImage);
      setInfoTooltipOpen(true);
      console.error("Error en la registración:", error);
    }
  };

  const handleSignin = async (email, password) => {

    try {

      const user = await auth.login(email, password);

      if (user.token) {
        setToken(user.token);

      } else {
        throw new Error("No se recibió un token.");
      }

      const userInfo = await getUserInfo();
      setCurrentUser(userInfo);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      setTooltipMessage("Uy, algo salió mal. Por favor, inténtalo de nuevo.");
      setTooltipLogo(errorImage);
      setInfoTooltipOpen(true);
      console.error("Error en el inicio de sesión:", error);
    }
  };

  const handleSignOut = () => {
    auth.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate("/signin");
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Header onSignOut={handleSignOut} isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/signup" element={<Register onRegister={handleSignup} />} />
          <Route path="/signin" element={<Login onLogin={handleSignin} />} />
          <Route path="/" element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <>

                <Main
                  cards={cards}
                  onEditProfileClick={() => setIsEditProfilePopupOpen(true)}
                  onAddPlaceClick={() => setIsAddPlacePopupOpen(true)}
                  onEditAvatarClick={() => setIsEditAvatarPopupOpen(true)}
                  onCardClick={setSelectedCard}
                  onCardLike={handleCardLike}
                  onCardDelete={(card) => {
                    setCardToDelete(card);
                    console.log("Card set for deletion:", card);
                    setIsDeletePopupOpen(true);
                  }}
                />

                <EditProfile
                  isOpen={isEditProfilePopupOpen}
                  onClose={closeAllPopups}
                  onUpdateUser={setCurrentUser}
                />

                <ConfirmDeletePopup
                  isOpen={isDeletePopupOpen}
                  onClose={closeAllPopups}
                  onConfirmDelete={handleCardDelete}
                  buttonText="Eliminar"
                />

                <AddPlacePopup
                  isOpen={isAddPlacePopupOpen}
                  onClose={closeAllPopups}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                />

                <EditAvatar
                  isOpen={isEditAvatarPopupOpen}
                  onClose={closeAllPopups}
                  onUpdateAvatar={handleUpdateAvatar}
                />

                <ImagePopup card={selectedCard} onClose={closeAllPopups} />
              </>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/signin" />} />

        </Routes>

        <InfoTooltip
          isOpen={infoTooltipOpen}
          message={tooltipMessage}
          logo={tooltipLogo}
          onClose={() => setInfoTooltipOpen(false)}

        />

        <Footer />

      </div>

    </CurrentUserContext.Provider>);

}


export default App;

