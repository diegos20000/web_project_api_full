import react from "react";
import closeButtonImage from "../images/Close Icon.jpg";

const InfoTooltip = ({isOpen, message, logo, onClose}) => {
    return (   
         isOpen && (      
         <div className="modal">      
         <div className="modal-content">
         <button className="close-button" onClick={onClose}>
            <img src={closeButtonImage} alt="cerrar" />
         </button>
            <img src={logo} alt="Logo"/>        
         <p>{message}</p>       
              
      </div>   
   </div>  
      )  
    );
};
    
export default InfoTooltip;