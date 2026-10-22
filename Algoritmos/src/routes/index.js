var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.redirect("/site/homepage-principal/index.html");
});

module.exports = router;