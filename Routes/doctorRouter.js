const express = require('express');
const router = express.Router();
const path = require('path');

var docController = require('../Controllers/doctorController');


router.post('/generateOtp',docController.generateOtp);
router.post('/verifyOtp',docController.verifyOtp,docController.register,docController.sendSms);
router.post('/checkNo',docController.checkNo);
router.post('/getDoctor',docController.getDoctor);

router.post('/resendOtp',docController.resendOtp);

router.post('/login',docController.login, docController.generateOtp);
router.post('/verifyOtpLogin',docController.verifyOtp);

router.post('/updateDoctor',docController.updateDoctor);
router.post('/updateClinic',docController.updateClinic);
router.post('/uploadFile',docController.uploadFile);
router.post('/myAppointments',docController.myAppointments);

router.post('/addPopular',docController.setPopularDoc)
router.post('/removePopular',docController.deletePopularDoc)

module.exports=router;
