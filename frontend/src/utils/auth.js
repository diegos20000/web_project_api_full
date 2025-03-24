const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

export const signup = async (email, password) => {
  try {  
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',   
      headers: {       
         'Content-Type': 'application/json', 
     },  
      body: JSON.stringify({ email, password }),
  });   
  if (!response.ok) {   
   const errorData = await response.json(); 
     console.error("Error en el registro:", errorData);  
     return { success: false, message: errorData.message || "Error en el registro" };   
     } 

     const data = await response.json();
     return { success: true, data };
     } catch (error) {  
     console.error("Error en la conexión:", error);  
     return { success: false, message: "Error en la conexión" };
  }
};

export const signin = async (email, password) => {
    try {  
      const response = await fetch(`${BASE_URL}/signin`, {
        method: 'POST',   
        headers: {       
             'Content-Type': 'application/json', 
       },  
        body: JSON.stringify({ email, password }),
    });   
    if (!response.ok) {   
        const errorData = await response.json(); 
          console.error("Error en el registro:", errorData);  
          return { success: false, message: errorData.message || "Error en la autenticación" };   
          } 

          const data = await response.json();
          return { success: true, token: data.token };
          } catch (error) {  
          console.error("Error en la conexión:", error);  
          return { success: false, message: "Error en la conexión" };
       }
  };