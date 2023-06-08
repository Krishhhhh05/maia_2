const express = require('express');
const router = express.Router();
const path = require('path');

var authController = require('../Controllers/authController');
let controller=require('../Controllers/common.controller')
router.post('/verify',controller.verify)

module.exports=router;
