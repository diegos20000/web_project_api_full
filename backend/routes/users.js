const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getUsers, getUserById, createUser, getCurrentUser } = require("../controllers/users");

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.get("/me", auth, getCurrentUser);


module.exports = router;
