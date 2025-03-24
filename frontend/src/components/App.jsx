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
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import "../../index.css";

import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import InfoTooltip from './InfoTooltip.jsx';
import { signup, signin } from '../utils/auth.js';

import checkImage from "../images/check.png";
import errorImage from "../images/x.png";

const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  //const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const [tooltipLogo, setTooltipLogo] = useState('');
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);  
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [cards, setCards] = useState([
    {
      isLiked: false,
      _id: "5d1f0611d321eb4bdcd707dd",
      name: "Yosemite Valley",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg",
      owner: "5d1f0611d321eb4bdcd707dd",
      createdAt: "2019-07-05T08:10:57.741Z",
      likes: [],
    },
    {
      isLiked: false,
      _id: "5d1f064ed321eb4bdcd707de",
      name: "Lake Louise",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg",
      owner: "5d1f0611d321eb4bdcd707dd",
      createdAt: "2019-07-05T08:11:58.324Z",
      likes: [],
    },
  ]);

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {  
    if (token) {     
       localStorage.setItem("token", token);  
    } else {   
       localStorage.removeItem("token");  
        } 
   }, [token]);

  useEffect(() => {

    if (token) {
      getUserInfo(token)
      .then(({username, email}) => {
        setIsLoggedIn(true);
        setCurrentUser({username, email});
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken("");
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
  }, [token]);

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
  }
  async function handleCardDelete() {
    if (!cardToDelete) {
      return;
    }
    setCards((prevCards) =>
      prevCards.filter((card) => card._id !== cardToDelete._id)
    );
    setCardToDelete(null);
    setIsDeletePopupOpen(false);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

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
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  const handleUpdateAvatar = async (data) => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
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
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsDeletePopupOpen(false);
  }

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken("");
    setIsLoggedIn(false);
    setCurrentUser({});
    navigate("/signin");
  };

  

  const getUserInfo = async (token) => {
    try {
      const response = await fetch('https://se-register-api.en.tripleten-services.com/v1/users/me', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if(response.ok) {
        const {data} = await response.json();
        return data;
      } else {
        throw new Error("No se pudo obtener la información del usuario");
      }
    }catch (error) {    
        console.error("Error al obtener la información del usuario:", error);  
        throw error;  
      }
   };
    
  

  const handleSignup = async (email, password) => {
    const result = await signup(email, password);
    if(result.success) {
      const registeredEmails = JSON.parse
      (localStorage.getItem("registeredEmails")) || [];
      registeredEmails.push(email);
      localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));
      console.log("Correos electrónicos registrados:", registeredEmails);

      setTooltipMessage("¡Correcto! Ya estás registrado.");
      setTooltipLogo(checkImage);
      setInfoTooltipOpen(true);
      setIsLoggedIn(true);
    } else {
      setTooltipMessage("Uy, algo salió mal. Por favor, inténtalo de nuevo.");
      setTooltipLogo(errorImage);
      setInfoTooltipOpen(true);
    }
  };

  const handleSignin = async (email, password) => {
    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];
    if (!registeredEmails.includes(email)) {
      setTooltipMessage("Uy, algo salió mal. Por favor, inténtalo de nuevo.");
      setTooltipLogo(errorImage);
      setInfoTooltipOpen(true);
      return;
    }

    const result = await signin(email, password);
    if(result.success) {
      localStorage.setItem("token", result.token);
      const userInfo = await getUserInfo(result.token);
      setCurrentUser(userInfo);
      setIsLoggedIn(true);
      navigate("/");
    }else {
      setTooltipMessage( "Uy, algo salió mal. Por favor, inténtalo de nuevo.");
      setTooltipLogo(errorImage);
      setInfoTooltipOpen(true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
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
                 
                </CurrentUserContext.Provider>  );
                
              }
  
  
              export default App;

