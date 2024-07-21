const express = require("express");
const router = express.Router(),
  path = require("path");

const GlobalCont = require("../Controllers/GlobalController");

// Doctor & Clinic
router.post('/getAll', GlobalCont.getAllUsers);
router.post('/getInvisible', GlobalCont.getAllDeletedUsers);
router.post('/getById', GlobalCont.getUserById);
router.post('/update', GlobalCont.update);
router.post('/registerNewDoctorCRM', GlobalCont.addNewDoctorUsingCrm);
router.post('/registerNewClinicCRM', GlobalCont.addNewClinicUsingCrm);
router.post('/hideUser', GlobalCont.hideUser);
router.post('/hideUser', GlobalCont.hideUser);
router.post('/getClinic', GlobalCont.getClinic);

router.post('/sanitize', GlobalCont.sanitizaAll);


// Appointment
router.post("/getAppointments", GlobalCont.getAppointments);
router.post("/getAllAppointments", GlobalCont.getAllAppointments);
router.post("/updateAppointment", GlobalCont.updateAppointment);

// CLient
router.post("/getClient", GlobalCont.getClient);
router.post("/getAllClients", GlobalCont.getAllClients);
router.post("/getAllPatients", GlobalCont.getAllPatients);
router.post("/updateClient", GlobalCont.updateClient);

router.post("/uploadFile", GlobalCont.uploadFile);
router.post("/sendSgMail", GlobalCont.sendSendGrid);

router.post("/trueCallback", GlobalCont.trueCallback);

//clean collection

router.delete("/cleanv2appointments", GlobalCont.cleanV2Appointments);
router.delete("/cleanClients", GlobalCont.cleanClients);
router.delete("/cleantreatments", GlobalCont.cleanTreatments);


router.post("/addClinicWValidation", GlobalCont.addClinicWValidation);


module.exports = router;