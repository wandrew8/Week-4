const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = Router();

const userDAO = require("../daos/user");

router.use(async (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

router.post("/signup", (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400).send("Must include an email and password")
    } else {
        bcrypt.hash(password, 10, async (err, hash) => {
            const newUser = await userDAO.signupUser(email, hash);
            if (newUser) {
                res.json(newUser);
                next();
            } else {
                res.sendStatus(404);
            }
        })
    }
})

router.post("/", (req, res, next) => {
    console.log(req);
    next();
})

router.post("/logout", (req, res, next) => {
    next();
})

router.post("/password", (req, res, next) => {
    next();
})

module.exports = router;



