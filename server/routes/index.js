const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin_controller");
const passport = require("passport");
const { checkBlacklist } = require("../config/checkblacklist");

router.post("/create", adminController.create);
router.post("/logged-in", adminController.login);
router.get("/get-user", passport.authenticate("jwt", {session: false}),checkBlacklist, adminController.getUser);
router.post("/logout", adminController.logout);
router.use("/employee", require("./employee"))

module.exports = router;