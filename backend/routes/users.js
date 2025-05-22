const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { 
    getUsers,
    getUserById,
    createUser,
    login,
    getCurrentUser,
    updateAvatar } = require("../controllers/users");



// Rutas protegidas
router.get("/me", auth, getCurrentUser);
router.get("/:id", auth, getUserById);
router.get("/", auth, getUsers);
router.patch("/me/avatar", auth, updateAvatar);


module.exports = router;
