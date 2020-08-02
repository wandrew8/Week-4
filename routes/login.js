const { Router, response } = require("express");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const secret = "this is my secret";
const saltRounds = 10;
const router = Router();


const userDAO = require("../daos/user");

router.use(async (req, res, next) => {
    console.log(`${req.method} login${req.path}`);
    const { email, password } = req.body;
    if(!email) {
        res.status(400).send("Email is required");
    } else if (!password) {
        res.status(400).send("Password is required");
    } else {
        res.status(500).send("Oops, server error!")
    }
});

//Set up this route for debugging purposes
router.get("/", async (req, res, next) => {
    const allUsers = await userDAO.findAll();
    if(allUsers) {
        res.json(allUsers);
        next();
    } else {
        res.status(500).send("Oops, server error!")
    }
})

// Logs in a user "POST /login"
router.post("/", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userDAO.findOne(email);
        if(user) {
            const isAuthenticated = await bcrypt.compare(password, user.password);
            if(isAuthenticated) {
                const findToken = await userDAO.findOneToken(user._id)
                if (findToken) {
                    res.json(findToken);
                } else {
                    const createToken = await userDAO.addUserToken(user._id, uuidv4());
                    res.json(createToken);
                }
            } else {
                res.status(401).send('You are not authenticated');
            }
        } else {
            res.status(401).send('Please create an account before trying to login');
        }
      } catch (err) {
        res.status(500).send("Oops, server error!")

      }
})

// Creates a new user "POST /login/signup"
router.post("/signup", (req, res, next) => {
    const { email, password } = req.body;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        const newUser = await userDAO.signupUser(email, hash);
        if (newUser) {
            res.json(newUser);
            next();
        } else {
            res.sendStatus(400);
        }
    })
    
})

// Logs out a user by removing their affiliated token from the database
router.post("/logout", async (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const isToken = await userDAO.findOneToken(bearerToken);
    if (!isToken) {
        res.status(401).send("Invalid token");
    }
    if (!bearerToken) {
        res.status(401).send("No authorization token found");
    }
    try {
        const logoutUser = await userDAO.logoutUser(bearerToken);
        if(logoutUser) {
            res.status(200).send("Successfully logged out")
        } else {
            res.status(401).send("Token not valid")
        }
    } catch (err) {
        res.status(500).send("Oops, server error!")
    }
})

router.post("/password", async (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const userToken = await userDAO.findOneTokenByTokenString(bearerToken);
    const { email, password } = req.body;
    if (!bearerToken) {
        res.status(401).send("No authorization token found");
    } else if (!userToken) {
        res.status(401).send("No token found")
    } else if (!email){
        res.status(401).send("Please include your email")
    } else if (!password) {
        res.status(401).send("Please include your password")
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const changePassword = await userDAO.changePassword(userToken.userId, hashedPassword);
            res.json(changePassword);
        } catch (err) {
            res.status(500).send("Oops, server error!")
        }

    }
})

module.exports = router;



