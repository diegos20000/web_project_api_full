const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getUsers, getUserById, createUser, login, getCurrentUser } = require("../controllers/users");

// Rutas públicas
router.post("/signup", createUser);
router.post("/signin", login);

// Rutas protegidas
router.get("/me", auth, getCurrentUser);
router.get("/:id", auth, getUserById);
router.get("/", auth, getUsers);


module.exports = router;
