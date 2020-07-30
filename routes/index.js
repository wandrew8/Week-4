const { Router } = require("express");
const router = Router();
const login = require("./login");
const notes = require("./notes");

router.use("/login", login);
router.use("/notes", notes);

module.exports = router;