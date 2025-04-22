import {setToken, getToken, removeToken} from "./token";

class Auth {
  constructor({ BASE_URL}) {
    this.BASE_URL = BASE_URL;
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
};



console.log(import.meta.env.VITE_BASE_URL);
const auth = new Auth({
  BASE_URL: "https://api.xyzzz.chickenkiller.com",
});

export default auth;

