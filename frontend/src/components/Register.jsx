import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header/Header";


const Register = ({onRegister}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(email, password);
        navigate("/login");
    };
    
    return ( 
        <div id="container">
           
        
        <form onSubmit={handleSubmit} id="container">    
        <h2>Registro</h2>    
         <input id="container_input"       
            type="email"        
            placeholder="Correo electrónico"       
            value={email}        
            onChange={(e) => setEmail(e.target.value)}     
            required      />     
        <input id="container_input"        
            type="password"       
             placeholder="Contraseña"       
             value={password}       
            onChange={(e) => setPassword(e.target.value)}       
             required    
          />     
         <button id="container_button" type="submit">Regístrate</button>
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
