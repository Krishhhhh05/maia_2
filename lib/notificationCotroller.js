//notificationController
var moment = require("moment");
const debug = require("debug");
let nc = {};
const {
  sendEmailSendGrid,
  mailObject,
  templates,
  sendMailPlain,
} = require("./emails/mailer_sendGrid_templated");
const { sendSms, smsConstants } = require("./smsManager/smsManager");
const { makeWhatsAppMessage } = require("./whatsapp/ghupshup-whatsapp");
const v2_appoint = require("../Models/appointmentsv2/v2_appointments");
const { getAddressString } = require("../helpers/helper");
let templateData = {
  pName: "aman",
  dName: "ola ola",
  clinic: "",
  cName: "Bola rebola",
  cNumber: "+kjdflakjdflksjdljsdlfjasd",
  cAddress: "afjlsdjflaskflasjflkajsljasdlf",
  date: "sdfkhafljlkjsflasdfas",
  message: "asdfjlaksjdlkfjalfjlasjdflajsdlfjalsdf",
};

nc.onNewAppointment = async function (obj) {
  let emailObj = {};
  emailObj = mailObject(emailObj);
  console.log(obj);
  let data = await getAppointmentData(obj._id);
  console.log(JSON.stringify(data));
  console.log("data", data);
  if (Array.isArray(data)) {
    data = JSON.parse(JSON.stringify(data[0]));
  }
  let t = getClinicDetails(data);

  // console.log("data",data.clinic.address);
  emailObj.tempData = getTemplateData(
    data.client.name,
    t.docName,
    t.cName,
    t.clinicDetails,
    t.cD,
    `Your appointment for ${t.date} is registered.`,
    t.date,
    "Thank you for booking an appointment with Velar"
  );

  emailObj.toEmailId = data.client.email;
  emailObj.tempId = getTemplateId(data);
  emailObj.subject = `Your appointment for ${t.date} is registered.`;

  sendSms(
    smsConstants.APPOINTMENT_NEW,
    { name: data.client.name },
    data.client.number,
    "+91"
  );
  sendEmailSendGrid(emailObj);
};
nc.onNewAppointmentApproved = async function (obj) {
  let emailObj = {};
  emailObj = mailObject(emailObj);
  let data = await getAppointmentData(obj._id);
  if (Array.isArray(data)) {
    data = JSON.parse(JSON.stringify(data[0]));
  }

  let t = getClinicDetails(data);
  emailObj.tempData = getTemplateData(
    data.client.name,
    t.docName,
    t.cName,
    t.clinicDetails,
    t.cD,
    `Your appointment for ${t.date} is confirmed.`,
    t.date,
    "Congratulations your appointment is confirmed"
  );
  emailObj.toEmailId = data.client.email;
  emailObj.tempId = getTemplateId(data);
  emailObj.subject = `Your appointment for ${t.date} is confirmed.`;
  sendSms(
    smsConstants.APPOINTMENT_CONFIRMED,
    { name: data.client.name },
    data.client.number,
    "+91"
  );
  sendEmailSendGrid(emailObj);
  // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, your appointment is now confirmed`)
};
nc.onNewAppointmentCancelled = async function (obj) {
  let emailObj = {};
  emailObj = mailObject(emailObj);
  // console.log(obj);
  let data = await getAppointmentData(obj._id);
  if (Array.isArray(data)) {
    data = JSON.parse(JSON.stringify(data[0]));
  }

  let t = getClinicDetails(data);
  emailObj.tempData = getTemplateData(
    data.client.name,
    t.docName,
    t.cName,
    t.clinicDetails,
    t.cD,
    `Your appointment for ${t.date} has been cancelled.`,
    t.date,
    "Your appointment has been cancelled"
  );
  emailObj.toEmailId = data.client.email;
  emailObj.tempId = getTemplateId(data);
  emailObj.subject = `Your appointment for ${t.date} has been cancelled.`;

  sendSms(
    smsConstants.APPOINTMENT_CANCELLED,
    { name: data.client.name },
    data.client.number,
    "+91"
  );
  sendEmailSendGrid(emailObj);
  // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, your appointment is now confirmed`)
};

function getTemplateId(data) {
  if (!data.doctor) {
    console.log("mailTemp", "CLINIC");
    return templates.appointment_clinic;
  } else {
    console.log("mailTemp", "NORMAL");

    return templates.appointment;
  }
}

nc.onAppointmentRescheduled = async function (obj) {
  let emailObj = {};
  emailObj = mailObject(emailObj);
  let data = await getAppointmentData(obj._id);
  if (Array.isArray(data)) {
    data = JSON.parse(JSON.stringify(data[0]));
  }
  emailObj.toEmailId = data.client.email;
  emailObj.tempId = getTemplateId(data);
  emailObj.subject = `Your appointment has been rescheduled.`;

  let t = getClinicDetails(data);
  emailObj.tempData = getTemplateData(
    data.client.name,
    t.docName,
    t.cName,
    t.clinicDetails,
    t.cD,
    `Your appointment has been rescheduled`,
    t.date,
    "Your appointment has been rescheduled"
  );
  sendSms(
    smsConstants.APPOINTMENT_RESCHEDULED,
    { name: data.client.name },
    data.client.number,
    "+91"
  );
  sendEmailSendGrid(emailObj);
  // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, your appointment is now confirmed`)
};
nc.onNewRegister = async function (data) {
  let emailObj = {};
  emailObj = mailObject(emailObj);
  debug("received new profile");

  // let data = await getAppointmentData(obj._id);
  // console.log(JSON.stringify(data));
  // console.log("data", data);
  // if (Array.isArray(data)) {
  //     data = JSON.parse(JSON.stringify(data[0]));
  // }
  // let t = getClinicDetails(data)

  // console.log("data",data.clinic.address);
  emailObj.tempData = { pName: data.name };

  emailObj.toEmailId = data.email;
  emailObj.tempId = templates.register;
  emailObj.subject = `Velar - Welcome to our family.`;

  // sendSms(smsConstants.APPOINTMENT_NEW, {name: data.client.name}, data.client.number, '+91')
  try {
    sendEmailSendGrid(emailObj);
    debug("emailSent");
  } catch (e) {
    console.error(e);
  }
};
// nc.appointment = async (obj) => {
//     let emailObj = {}
//     emailObj = mailObject(emailObj);
//     let data = await getAppointmentData(obj._id);
//     if (Array.isArray(data)) {
//         data = JSON.parse(JSON.stringify(data[0]));
//     }
//     emailObj.toEmailId = data.client.email;
//     emailObj.tempId = templates.appointment;
//     emailObj.subject = `Your appointment has been rescheduled.`
//
//     let t = getClinicDetails(data)
//     emailObj.tempData = getTemplateData(data.client.name, t.docName, t.cName, t.clinicDetails, t.cD, `Your appointment has been rescheduled`, t.date, 'Your appointment has been rescheduled')
//     sendSms(smsConstants.APPOINTMENT_RESCHEDULED, {name: data.client.name}, data.client.number, '+91')
//     sendEmailSendGrid(emailObj)
//     // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, your appointment is now confirmed`)
// }
nc.onNewEnquiry = (data) => {
  sendMailPlain({
    toEmailId: "enquiry@velaarheath.com",
    subject: "New Enquiry",
    text: ` Name:  ${data.name} \n Number:  ${data.number}`,
  });
};

module.exports = nc;

async function getAppointmentData(id) {
  let kk = await v2_appoint
    .find({ _id: id })
    .populate({
      path: "client",
    })
    .populate({
      path: "clinic",
      select: "number name email address contact_no",
    })
    .populate({
      path: "doctor",
      select: "number name email address",
    });
  return kk;
}

// getAppointmentData('5e81ec2f8c5f985006baa276').then(console.log).catch(console.log)
// let emailObj={}
// // Object.assign(emailObj['tempData'],templateData)
// emailObj.tempData=Object.assign(templateData)
// console.log(emailObj);
function getTemplateData(
  pName,
  docName,
  cName,
  cAddress,
  cNumber,
  subject,
  date,
  message
) {
  let k = Object.assign(templateData);
  k.pName = pName.charAt(0).toUpperCase() + pName.slice(1);
  k.dName = docName;
  k.cName = cName;
  k.subject = subject;
  k.date = date;
  k.message = message;
  k.cAddress = cAddress;
  k.cNumber = cNumber;

  return k;
}

function getClinicDetails(data) {
  let docName = "";
  let clinicDetails = "";
  let cD = "",
    cName = "",
    date = "";

  try {
    docName = data.doctor.name ? data.doctor.name : "";
  } catch (e) {}
  try {
    cName = data.clinic.name ? data.clinic.name : "";
  } catch (e) {}
  // console.log('data.clinic.address',data.clinic.address);
  try {
    clinicDetails = getAddressString(data.clinic.address);
  } catch (e) {}
  try {
    cD = data.clinic.contact_no ? data.clinic.contact_no : "";
  } catch (e) {}
  // cD = `${docName} \\n ${clinicDetails} \\n ${data.clinic.contact_no}`
  try {
    date = new Date(data.bookingDate).toDateString();
    // date = moment(data.bookingDate,"DD-MM-YYYY").format("ddd, Do MMMM YYYY ")
  } catch (e) {}
  let t = { docName, clinicDetails, cD, cName, date };
  // console.log(JSON.stringify(t));
  return t;
}

//specialization
// console.log('ll', new Date('2020-04-04T22:04:30.614Z').toDateString());
// console.log('ll',Date.parse('23-11-2020'));
// nc.onNewAppointment({_id:'5e850600edc2b72a80f4ff0d'})

// getClinicDetails(null)
// let day=moment("30-04-2020","DD-MM-YYYY").format("ddd, Do MMMM YYYY ")
// console.log(day);
