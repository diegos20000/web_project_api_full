import token from "./token";

class Api {
    constructor({baseUrl, headers}) {
        this.baseUrl = baseUrl;
        this.headers = headers;
    }

    getUserInfo() {
        return fetch(`${this.baseUrl}/users/me`, {
            header: this.headers,
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Error: ${res.status}`);
        })
        .catch ((error) => {
            console.log(error);
        });
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
        baseUrl: "http://api.xyzzz.chickenkiller.com",
        headers: {
            authorization: "c7a246af-e2b0-4a14-bf89-44beb7938eee",
            "content-Type": "application/json",

            authorization: token.getToken(),
        },
    });

export default api;