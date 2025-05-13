import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header/Header";

const Login = ({onLogin}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
        setIsModalOpen(true);
        
    };

    const closeModal = () => {
        setIsModalOpen(false);
        navigate("/")
    }

    return (  
    <div id="container">
        
      
    <form onSubmit={handleSubmit} id="container">     
     <h2>Iniciar Sesión</h2>   
     <input id="container_input"       
        type="email"    
        placeholder="Correo electronico"    
        onChange={(e) => setEmail(e.target.value)}    
        required     
         />     
     <input id="container_input"       
        type="password"    
        placeholder="Contraseña"     
        value={password}     
        onChange={(e) => setPassword(e.target.value)}     
        required    
           />     
         <button id="container_button" type="submit">Inicia sesión</button>
         <p>      
            ¿Aún no eres miembro? <span onClick={() => 
            navigate("/signup")} style={{ cursor: 'pointer', color: 'blue'
             }}
             >Regístrate aquí</span>     
              </p>
             
          </form>
          
          
          </div>
          );
     };
                
    export default Login;

