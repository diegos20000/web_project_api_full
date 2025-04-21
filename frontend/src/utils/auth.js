import {setToken, getToken, removeToken} from "./token";

class Auth {
  constructor({ baseUrl}) {
    this.baseUrl = baseUrl;
  }

  _request(endpoint, method = "GET", body = null) {
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(`${this.BASE_URL}${endpoint}`, options).then((res) =>
    (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)));
 }

  register(email, password) {
  return this._request("/signup", "POST", {email, password})
    .then((data) => {
      if (data.token) {
        setToken(data.token);
      }
      return data;
  })
  .catch((error) => {
    console.log("Error en la registracion", error);
    throw error;
  });
}

  login(email, password) {
    return this._request("/signin", "POST", {email, password})
    .then((data) => {
       if (data.token) {
        setToken(data.token);
       }
      return data;
   })
  .catch((error) => {
    console.log("Error en el acceso", error); 
    throw error;
  });
}

  logout() {
    removeToken();
  }

  getUserInfo() {
    return this._request("/users/me")
      .catch((error) => {
        console.log("Error al obtener información del usuario", error);
        throw error;
   });
 }
}

export const signup = async (email, password) => {
  try {  
    const response = await fetch(`${this.BASE_URL}/signup`, {
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
    const response = await fetch(`${this.BASE_URL}/signin`, {
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

const auth = new Auth({
  baseUrl: "http://api.xyzzz.chickenkiller.com",
});

export default auth;

