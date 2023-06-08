const express = require('express');
const router = express.Router();
const path = require('path');

var authController = require('../Controllers/authController');

router.post('/login', authController.login);
router.post('/loginWithPassword', authController.loginWithPassword);
router.post('/signup', authController.create);

module.exports=router;