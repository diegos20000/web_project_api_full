const bcrypt = require("bcrypt");

async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

function updateUserProfile(user, updates) {
    const {name, about, avatar} = updates;
    user.name = name || user.name;
    user.about = about || user.about;
    user.avatar = avatar || user.avatar;
    return user;
}

function likeCard(card, userId) {
    if (!card.likes.includes(userId)) {
        card.likes.push(userId);
    }
    return card;
}

module.exports = {verifyPassword, updateUserProfile, likeCard};