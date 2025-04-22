import token from "./token";

class Api {
    constructor({BASE_URL, headers}) {
        this.BASE_URL = BASE_URL;
        this.headers = headers;
    }

    async getUserInfo() {
        try {  
           const res = await fetch(`${this.BASE_URL}/users/me`, { 
              headers: this.headers,          
        });      
        if (!res.ok) {   
              throw new Error(`Error: ${res.status}`);     
         }    
         return await res.json();    
     } catch (error) {    
         console.log(error);  
         throw error;     
       }
    }

    getInitialCards() {
        return fetch(`${this.baseUrl}/cards`, {
            headers: this.headers,
        })
        .then((res) => {
            if (res.ok)  {
                return res.json();
            }
            return Promise.reject(`Error: ${res.status}`)
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateUserProfile(name, about) {
        return fetch(`${this.baseUrl}/users/me`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify({
                name: name,
                about: about,
            }),
        })
        .then((res) => {
            if (res.ok)  {
                return res.json();
            }
            return Promise.reject(`Error: ${res.status}`);
        })
        .catch((error) => {
            console.log(error);
        }); 
    }

    createCard(link, name) {
        return fetch(`${this.baseUrl}/cards`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                link: link,
                name: name,
            }),
         })
         .then((res) => {
            if (res.ok)  {
                return res.json();
            }
            return Promise.reject(`Error: ${res.status}`)
        })
        .catch((error) => {
            console.log(error);
        }); 
    }

    deleteCard(cardId) {
        return fetch(`${this.baseUrl}/cards/${cardId}`, {
            method: "DELETE",
            headers: this.headers,
        })
        .then((res) => {
            if (res.ok)  {
                return res.json();
            }
            return Promise.reject(`Error: ${res.status}`)
        })
        .catch((error) => {
            console.log(error);
        }); 
    }

    changeLikeCardStatus(cardId, isLiked) {
        return fetch(`${this.baseUrl}/cards/likes${cardId}`, {
            method: isLiked ? "DELETE" : "PUT",
            headers: this.headers,
          })
          .then((res) => {
            if (res.ok)  {
                return res.json();
            }
            return Promise.reject(`Error: ${res.status}`)
        })
        .catch((error) => {
            console.log(error);
        });
    }
    updateAvatar(avatar) {
        return fetch(`${this.baseUrl}/users/me/avatar`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify({
                avatar: avatar,
            }),
          })
          .then((res) => {
            if (res.ok)  {
                return res.json();
            }
            return Promise.reject(`Error: ${res.status}`)
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

const api = () =>
    new Api({
        BASE_URL: "http://api.xyzzz.chickenkiller.com",
        headers: {
            authorization: token.getToken(),
            "content-Type": "application/json",

            
        },
    });

export default api;