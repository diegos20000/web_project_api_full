const { verifyPassword, updateUserProfile, likeCard } = require('./function');
const bcrypt = require('bcrypt');

describe("User Functions", () => {
    test("verifyPassword should return true for correct password", async () => {
        const plainPassword = "password123";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const result = await verifyPassword(plainPassword, hashedPassword);
        expect(result).toBe(true);
    });


    test("updateUserProfile should update user profile correctly", () => {
        const user = { name: 'Old Name', about: 'Old About', avatar: 'old-avatar.png' };
        const updates = { name: 'New Name', about: 'New About' };

        const updatedUser = updateUserProfile(user, updates);
        expect(updatedUser.name).toBe('New Name');
        expect(updatedUser.about).toBe('New About');
        expect(updatedUser.avatar).toBe('old-avatar.png');
    });

    test("likeCard should add userId to likes array", () => {
        const card = { likes: [] };
        const userId = 'user123';

        const updatedCard = likeCard(card, userId);
        expect(updatedCard.likes).toContain(userId);
    });

    test("likeCard should not add userId if already liked", () => {
        const userId = 'user123';
        const card = { likes: [userId] }

        const updatedCard = likeCard(card, userId);
        expect(updatedCard.likes).toHaveLength(1);
    });
});