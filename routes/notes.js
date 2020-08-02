const { Router } = require("express");
const router = Router();

const noteDAO = require("../daos/notes");


//Middleware function to authenticate all /notes routes
router.use(async (req, res, next) => {
    console.log(`${req.method} notes${req.path}`);
    const bearerToken = req.headers.authorization.split(" ")[1];
    const isAuthenticated = await noteDAO.findToken(bearerToken);
    if (!bearerToken) {
        res.status(401).send("No token found")
    }
    if (isAuthenticated) {
        const user = await noteDAO.findUser(isAuthenticated.userId);
        req.user = user;
        next();
    } else {
        res.status(401).send("You are not authorized to view these notes");
    }
});

router.post("/", async (req, res, next) => {
    const { text } = req.body;
    const userId = req.user._id;
    try {
        const note = await noteDAO.addNote(text, userId)
        if (note) {
            res.status(200);
            res.json(note);
        } else {
            res.status(401).send("Note not added");
        }
    } catch (err) {
        res.status(500).send("Oops, server error!")
    }
})

router.get("/", async (req, res, next) => {
    const userId = req.user._id;
    try {
        const notes = await noteDAO.getNotes(userId)
        if (notes) {
            res.status(200);
            res.json(notes);
        } else {
            res.status(401).send("No notes found")
        }
    } catch (err) {
        res.status(500).send("Oops, server error!")
    }
})

router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const note = await noteDAO.getSingleNote(id)
        if (note) {
            res.status(200);
            res.json(note);
        } else {
            res.status(401).send("Could not find the note you were looking for")
        }
    } catch (err) {
        res.status(500).send("Oops, server error!")
    }
})

module.exports = router;
