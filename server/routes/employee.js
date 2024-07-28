const express = require("express");
const passport = require("passport");
const router = express.Router();
const employeeController = require("../controller/employee_controller");
const {checkBlacklist} = require("../config/checkblacklist")

router.post("/create", passport.authenticate("jwt", {session: false}), checkBlacklist, employeeController.create);
router.patch("/update/:id", passport.authenticate("jwt", {session: false}), checkBlacklist, employeeController.edit);
router.delete("/delete/:id", passport.authenticate("jwt", {session: false}), checkBlacklist, employeeController.delete);
router.get("/get-details", passport.authenticate("jwt", {session: false}), checkBlacklist, employeeController.getData);
router.get("/single-data/:id",passport.authenticate("jwt", {session: false}), checkBlacklist, employeeController.singleData)

module.exports = router;