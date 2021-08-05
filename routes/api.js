const express = require("express");
const controllers = require("../controllers/controller");
const router = express.Router();
router.post("/signup", controllers.signup);
module.exports = router;
