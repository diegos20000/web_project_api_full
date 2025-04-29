import React, { useState, useEffect } from "react";
import Header from "./Header/Header.jsx";
import Main from "./Main.jsx";
import Card from "./Card/Card.jsx";
import ConfirmDeletePopup from "./ConfirmDeletePopup.jsx";
import ImagePopup from "./ImagePopup/ImagePopup.jsx";
import EditProfile from "./EditProfile/EditProfile.jsx";
import EditAvatar from "./Avatar/EditAvatar.jsx";
import AddPlacePopup from "./AddPlacePopup.jsx";
import Footer from "./Footer/Footer.jsx";
import { CurrentUserProvider } from "../contexts/CurrentUserContext.jsx";
import "../../index.css";

import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import InfoTooltip from './InfoTooltip.jsx';
import { setToken, getToken, removeToken } from "../utils/token.js";

import auth from '../utils/auth.js';

import checkImage from "../images/check.png";
import errorImage from "../images/x.png";
import apiInstance from "../utils/api.js";

const BASE_URL = "http://localhost:5005";


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const [tooltipLogo, setTooltipLogo] = useState('');
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);  
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  

  const [token, setTokenState] = useState(getToken() || "");

  const updateToken = (newToken) => {  
    setToken(newToken);
    localStorage.setItem("token", newToken);
    console.log('Token almacenado:', newToken);
    setTokenState(newToken);
  };
    
  const removeToken = () => { 
    localStorage.removeItem("token"); 
     setToken("");
  };
  
  
  useEffect(() => {
    const fetchUserInfo = async () => {  
       if (token) {  
         try {      
           const userInfo = await getUserInfo(token);
           const response = await fetch(`${BASE_URL}/cards`, {  
               method: "GET",     
               headers: {           
                   'Authorization': `Bearer ${token}`,     
              },    
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const initialCards = await response.json();
           
           setCurrentUser(userInfo); 
           setCards(initialCards); 
           setIsLoggedIn(true);
           navigate("/");    
         } catch (error) {   
           console.error("Error fetching user info:", error);  
           removeToken();      
        }     
      }    
     };   
       fetchUserInfo(); 
    }, [token, navigate]);

    useEffect(() => {
      const fetchInitialCards = async () => {
        try {
          const response = await apiInstance.getInitialCards();
          if (response && Array.isArray(response)) {
            setCards(response);

          } else {
            console.error("La respuesta no es un array de tarjetas");
          }
          
        } catch (error) {
          console.error("Error loading initial cards:", error);
        }
      };
      fetchInitialCards();
    }, []);

  useEffect(() => { 
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
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleDeletePopupClick(card) {
    setCardToDelete(card);
    setIsDeletePopupOpen(true);
  };

  function handleCardLike(card) {
    const likes = card.likes || [];
    const isLiked = likes.some((i) => i._id === currentUser._id);
    const updatedCards = cards.map((c) => {
      if (c._id === card._id) {
        return {
          ...c,
          likes: isLiked
            ? likes.filter((i) => i._id !== currentUser._id)
            : [...likes, currentUser],
        };
      }
      return c;
    });
    setCards(updatedCards);
  };
  async function handleCardDelete() {
    if (!cardToDelete) {
      return;
    }
    setCards((prevCards) =>
      prevCards.filter((card) => card._id !== cardToDelete._id)
    );
    setCardToDelete(null);
    setIsDeletePopupOpen(false);
  };
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleAddPlaceSubmit({ link, name }) {
    const newCard = {
      _id: Date.now().toString(),
      link,
      name,
      isLiked: false,
      likes: [],
    };
    setCards((prevCards) => [newCard, ...prevCards]);
    closeAllPopups();
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  };

  const handleUpdateAvatar = async (data) => {
    
    try {
      
      const response = await fetch(`${BASE_URL}/users/me/avatar`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar: data.avatar,
        }),
      });
      
      if(response.ok) {
        const updatedUser = await response.json();
        setCurrentUser((prevState) => ({
          ...prevState,
          avatar: updatedUser.avatar,
        }));
        closeAllPopups();
      } else {
        throw new Error("Error al actualizar avatar");
      }
    } catch(error) {
      console.log("Error updating avatar:", error);
    }
  };

  function onUpdateUser(user) {
    setCurrentUser(user);
    closeAllPopups();
  };

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsDeletePopupOpen(false);
  };

  const handleLogin = (newToken) => {
    updateToken(newToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    removeToken();
    setTokenState("");
    setIsLoggedIn(false);
    setCurrentUser({});
    navigate("/signin");
  };

  

  const getUserInfo = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if(response.ok) {
        const userInfo = await response.json();
        
        return userInfo;
      } else {
        throw new Error("No se pudo obtener la información del usuario");
      }
    }catch (error) {    
        console.error("Error al obtener la información del usuario:", error);  
        throw error;  
      }
   };
    
  

  const handleSignup = async (email, password) => {
    try {
    const result = await auth.register(email, password);

    if (result && result.token) {   
       updateToken(result.token);
       const registeredEmails = JSON.parse
       (localStorage.getItem("registeredEmails")) || [];

    if(!registeredEmails.includes(email)) {
      registeredEmails.push(email);
      localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));
    }
      setTooltipMessage("¡Correcto! Ya estás registrado.");
      setTooltipLogo(checkImage);
      setInfoTooltipOpen(true);
      setIsLoggedIn(true);
      navigate("/");
      
    } else {
      setTooltipMessage("Uy, algo salió mal. Por favor, inténtalo de nuevo.");
      setTooltipLogo(errorImage);
      setInfoTooltipOpen(true);
    }
   } catch (error) {     
    console.error("Error en el inicio de sesión:", error);  
    setTooltipMessage("Uy, algo salió mal. Por favor, inténtalo de nuevo.");   
    setTooltipLogo(errorImage);  
    setInfoTooltipOpen(true);   
   }
  };

  const handleSignin = async (event, email, password) => {
    event.preventDefault();
    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];

    if (!registeredEmails.includes(email)) {
      setTooltipMessage("Uy, algo salió mal. Por favor, inténtalo de nuevo.");
      setTooltipLogo(errorImage);
      setInfoTooltipOpen(true);
      return;
    }

    try {
      const result = await auth.login(email, password);

    if(result && result.token) {
      setToken(result.token);
      console.log('Token almacenado:', result.token);
      updateToken(result.token);
      
      const userInfo = await getUserInfo(result.token);
      setCurrentUser(userInfo);
      setIsLoggedIn(true);
      navigate("/");
    } else {
      setTooltipMessage( "Uy, algo salió mal. Por favor, inténtalo de nuevo.");
      setTooltipLogo(errorImage);
      setInfoTooltipOpen(true);
     }
    } catch (error) {     
      console.error("Error en el inicio de sesión:", error);  
      setTooltipMessage("Uy, algo salió mal. Por favor, inténtalo de nuevo.");   
      setTooltipLogo(errorImage);  
      setInfoTooltipOpen(true);   
     }
  };

  const handleSignOut = () => {
    removeToken();
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate("/signin");
  };

  return (  
      <CurrentUserProvider>  
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
                 
          </CurrentUserProvider>  
        );
                
      }
  
  
     export default App;