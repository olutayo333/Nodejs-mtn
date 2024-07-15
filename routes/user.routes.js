
const express = require("express");
const router = express.Router()

const {register, signin, userDetails, addData, dataDetails, getDashboard }= require('../controllers/user.controllers')
const {adminRegister, adminSignin, adminDashboard, edituser, deleteuser, transactions} = require('../controllers/admin.controller')

//ROUTES
router.post("/adminregister", adminRegister)
router.post("/adminsignin", adminSignin)
router.get("/admindashboard", adminDashboard)
router.post("/edituser", edituser)
router.post("/deleteuser", deleteuser)
router.get("/transactions", transactions)

router.post("/register", register)
router.post("/signin", signin)
router.post("/userDetails", userDetails)
router.post("/dataDetails", dataDetails)  //purchased data
router.post("/dataBalance", addData)
router.get("/getdashboard", getDashboard)

module.exports = router