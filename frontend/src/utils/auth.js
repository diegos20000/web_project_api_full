import {setToken, getToken, removeToken} from "./token";

class Auth {
  constructor({ BASE_URL}) {
    this.BASE_URL = BASE_URL;
  }

  async _request(endpoint, method = "GET", body = null) {
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

    const res = await fetch(`${this.BASE_URL}${endpoint}`, options);
    if (!res.ok) { 
      const errorData = await res.json();
      throw new Error(`Error ${res.status}: ${errorData.message || res.statusText}`);   
    } 
     return res.json(); 
   }

  async register(email, password) {
    try {
      const data = await this._request("/signup", "POST", { email, password });
      console.log(data);
      if (data.token) {
        setToken(data.token);
      }
      return data;

  } catch (error)  {
    console.log("Error en la registracion", error);
    throw error;
  }
}

  async login(email, password) {
    try {
      const data = await this._request("/signin", "POST", { email, password });
      if (data.token) {
        setToken(data.token);
      }
    return data;
   } catch (error) {
    console.log("Error en el acceso", error); 
    throw error;
  }
}

  logout() {
    removeToken();
  }

  async getUserInfo() {
    return this._request("/users/me")
      .catch((error) => {
        console.log("Error al obtener información del usuario", error);
        throw error;
   });
 }
};




const auth = new Auth({
  BASE_URL: "http://localhost:5003",
});

export default auth;

