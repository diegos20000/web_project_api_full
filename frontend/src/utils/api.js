import { getToken } from "./token";

class Api {
    constructor({BASE_URL}) {
        this.BASE_URL = BASE_URL;
    }

    headers() {
        const token = getToken();
        console.log('Token usado para la solicitud:', token);
        return {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        };
    }

    async getUserInfo() {
        try {  
           const res = await fetch(`${this.BASE_URL}/users/me`, { 
                method : "GET",
                headers: this.headers(),          
        });      
        if (!res.ok) {   
              throw new Error(`Error: ${res.status} - ${res.statusText}`);     
         }
         
         const data = await res.json();
         
         if (!data || typeof data !== 'object') {
            throw new Error("La respuesta no tiene el formato esperado.");
        }
        return data;
     } catch (error) {    
         console.log("Error al obtener la información del usuario:", error);  
         throw error;     
       }
    }

    async getInitialCards() {
        try {
            console.log('Token used for request:', getToken());
            const res = await fetch(`${this.BASE_URL}/cards`, {
                method: "GET",
                headers: this.headers(),
            });   
        
        if (!res.ok)  {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
         }
         return await res.json();
        }catch(error)  {
            console.log("Error fetching initial cards:", error);
            throw error;
        }
    }

    async updateUserProfile(name, about) {
        try {
            const res = await fetch(`${this.BASE_URL}/users/me`, {
                method: "PATCH",
                headers: this.headers(),
                body: JSON.stringify({ name, about }),
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        return await res.json();
      } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    }

    async createCard(link, name) {
        try {
            const res = await fetch(`${this.BASE_URL}/cards`, {
                method: "POST",
                headers: this.headers(),
                body: JSON.stringify({ link, name }),
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        return await res.json();
      } catch (error) {
        console.error("Error creating card:", error);
        throw error;
        }
    }

    async deleteCard(cardId) {
        try {
            const res = await fetch(`${this.BASE_URL}/cards/${cardId}`, {
                method: "DELETE",
                headers: this.headers(),
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error deleting card:", error);
        throw error;
    }
}

    async changeLikeCardStatus(cardId, isLiked) {
        try {
            const res = await fetch(`${this.BASE_URL}/cards/${cardId}/likes`, {
                method: isLiked ? "DELETE" : "PUT",
                headers: this.headers(),
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error changing like status:", error);
        throw error;
    }
}
    
    async updateAvatar(avatar) {
        try {
            const res = await fetch(`${this.BASE_URL}/users/me/avatar`, {
                method: "PATCH",
                headers: this.headers(),
                body: JSON.stringify({ avatar }),
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error updating avatar:", error);
        throw error;
    }
}
}

const api = new Api({
        BASE_URL: "https://api.xyzzz.chickenkiller.com",
    });

export default api;