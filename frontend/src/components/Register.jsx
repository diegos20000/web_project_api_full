import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import auth from "../utils/auth";


const Register = ({onRegister}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await auth.register(email, password);
            navigate("/login");
        } catch (error) {
            console.error("Error en el registro:", error);
            setError(error.message);
        }
        
    };
    
    return ( 
        <div id="container">
           
        
        <form onSubmit={handleSubmit} id="register-form">    
        <h2>Registro</h2>    
         <input id="register-email"       
            type="email"        
            placeholder="Correo electrónico"       
            value={email}        
            onChange={(e) => setEmail(e.target.value)}     
            required      />     
        <input id="register-password"        
            type="password"       
            placeholder="Contraseña"       
            value={password}       
            onChange={(e) => setPassword(e.target.value)}       
            required    
          />     
         <button id="register-button" type="submit">Regístrate</button>
         <p>      
          ¿Ya eres miembro? <span onClick={() => 
          navigate("/login")} style={{ cursor: 'pointer', color: 'blue'
          }}
          >Inicia sesión aquí</span>    
            </p>   
         </form> 
         </div> 
        );
    };
    
    export default Register;    
