const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getUsers, getUserById, createUser, getCurrentUser } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.get("/:id", auth, getUserById);
router.get("/", auth, getUsers);


module.exports = router;
