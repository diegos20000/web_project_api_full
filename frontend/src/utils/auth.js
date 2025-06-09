import { setToken, getToken, removeToken } from "./token";

class Auth {
  constructor({BASE_URL}) {
    this.BASE_URL = BASE_URL;
  }


async _request(endpoint, method = "GET", body = null) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

if (token) {
  headers["Authorization"] = `Bearer ${token}`;
  
}else {       
  console.error("Token no proporcionado.");   
 }

const options = {
  method,
  headers,
  ...(body && { body: JSON.stringify(body) }),
};

try {
  const res = await fetch(`${this.BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || res.statusText);
  }
  return await res.json();
} catch (error) {
  console.error("Error en la solicitud:", error);
  throw new Error("Error en la comunicación con el servidor");
}
}

async register(email, password) {
  
  try {
    const data = await this._request("/signup", "POST", { email, password });
     if (data.token) {
      setToken(data.token);
     }
     return data;
  } catch (error) {
    console.error("Error en la registración:", error);
    throw error;
  }
}

async login (email, password) {
  try {
    const data = await this._request("/signin", "POST", { email, password });
    if (data.token) {
      setToken(data.token);
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error en el acceso:", error);
    throw error;
  }
}

logout() {
  removeToken();
}

async getUserInfo() {
  try {
    return await this._request("/users/me", "GET");
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    throw error;
  }
}
}

const auth = new Auth({
  BASE_URL: "http://localhost:5002",
});

export default auth;