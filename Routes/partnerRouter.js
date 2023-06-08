const express = require('express');
const router = express.Router(),
       path = require('path') ;

var authRouter = require('./authRouter');

router.use('/auth',authRouter);

// router.post('/getMe',getMe);

// router.post('/sendEmail',sendEmail);

module.exports=router;
