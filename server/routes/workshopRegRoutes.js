const express = require("express");
const {createRegistration, getAllRegistration, deleteRegistration} = require('../controllers/workshopRegController.js');

const router = express.Router();
router.route('/registration/:id').post(createRegistration);
router.route('/getregs').post(getAllRegistration);
router.route('/delete/:id').delete(deleteRegistration); // a middleware has to be injected which can 
// query for the current userid by which deletion can be done there on controller side

module.exports = router;
