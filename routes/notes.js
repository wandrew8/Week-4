const { Router } = require("express");
const router = Router();

//All of these routes require authentication
//This middleware should verify that the user is authenticated
router.use(async (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

router.post("/", (req, res, next) => {
    console.log("You posted a new note")
})

router.get("/", (req, res, next) => {

})

router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    console.log(id);
})

module.exports = router;
