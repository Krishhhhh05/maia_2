const express = require('express');
const router = express.Router();
const path = require('path');

const manageCont = require('../Controllers/managementController');

router.get('/getOverView',manageCont.getOverView);

router.post('/getDoctorsByClinic',manageCont.getDoctorsByClinic);

router.post('/sendSms',manageCont.sendSms);

router.post('/getClientByNumber',manageCont.getClientByNumber);
router.post('/getUserByNumber',manageCont.getUserByNumber);

router.post('/call',manageCont.call);

router.post('/getAppointmentOverview',manageCont.getAppointmentOverview);
router.post('/search',manageCont.search);

router.post('/mapDocClinic',manageCont.mapDoctorAndClinic);
router.post('/removeMapping',manageCont.removeMapping);





module.exports=router;