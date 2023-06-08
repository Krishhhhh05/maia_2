var User = require("../Models/User");
var Clinic = require("../Models/Clinic");
var Client = require("../Models/Clients");
var Appointment = require("../Models/Appointments");
var keys = require("../Config/keys");
var querystring = require("querystring");
var ObjectId = require("mongodb").ObjectID;

var { DoctorStatus, DocCategories } = require("../Config/statuses");
var msg91Key = keys.msg91key;

const request = require("request-promise");

var cont = {
  getOverView: async function (req, res) {
    try {
      var newReg = await User.find({ status: DoctorStatus.Registered }).count();
      var verified = await User.find({ status: DoctorStatus.verified }).count();

      res.send({ newReg, verified });
    } catch (error) {
      res.send(error.message);
    }
  },

  getDoctorsByClinic: async function (req, res) {
    try {
      var clinic_id = ObjectId(req.body.clinic_id);

      console.log("clinic_id", clinic_id);

      var result = await User.find({ clinics: clinic_id }).lean();
      res.send(result);
    } catch (error) {
      res.send(error.message);
    }
  },

  sendSms: async function (req, res) {
    try {
      var message = req.body.message;
      if (typeof req.body.number === "undefined" || req.body.number === null)
        throw new Error("invalid number");

      var options = {
        url: "https://api.msg91.com/api/v2/sendsms?country=91",
        body: {
          sender: "SOCKET",
          route: "4",
          country: "91",
          sms: [
            {
              message: message,
              to: [req.body.number],
            },
          ],
        },
        json: true,
        headers: {
          authkey: msg91Key,
          "content-type": "application/json",
        },
      };

      var response = await request.post(options);
      // if(response.status !== 'Success')
      console.log("res ", response.status);

      res.send(response);
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },

  call: async function (req, res) {
    try {
      //get the logged in user
      // var user = await User.findById(res.locals.id);

      // var from = user.number;
      var from = "8828183820";
      var to = req.body.to;
      var dataString = `From=${from}&To=${to}&CallerId=${keys.exotelCallerId}`;
      // var formData = querystring.stringify(dataString);
      // var contentLength = formData.length;

      var options = {
        url: `https://${keys.exotelApiKey}:${keys.exotelApiToken}${keys.exotelSubDomain}/v1/Accounts/${keys.exotelApiSID}/Calls/connect.json`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        form: dataString,
      };

      var result = await request.post(options);

      res.send(result);
    } catch (error) {
      res.send({ success: false, msg: error.message });
    }
  },
  getClientByNumber: async function (req, res) {
    try {
      var number = req.body.number;
      var result = await Client.findOne({ number: number }).lean();
      if (!result) throw new Error();

      res.send({
        data: result,
        success: true,
      });
    } catch (error) {
      res.send({
        success: false,
      });
    }
  },
  getAppointmentOverview: async function (req, res) {
    var findString = {};
    var findStrings = {};

    try {
      var start = new Date();
      start.setHours(0, 0, 0, 0);

      var end = new Date();
      end.setHours(23, 59, 59, 999);

      findString["registeredOn"] = {
        $gte: start.getTime(),
        $lte: end.getTime(),
      };

      var t = await Appointment.find(findString).count();
      let today = new Date();

      var first = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
      var last = first + 6; // last day is the first day + 6

      var firstday = new Date(today.setDate(first));
      firstday.setHours(0, 0, 0, 0);
      var lastday = new Date(today.setDate(last));
      lastday.setHours(23, 59, 59, 999);

      findString["registeredOn"] = {
        $gte: firstday.getTime(),
        $lte: lastday.getTime(),
      };
      var w = await Appointment.find(findString).count();
      console.log("week:", w);
      let day = new Date();

      findStrings["$or"] = [
        {
          registeredOn: { $lte: day.getTime() },
          status: "SCHEDULED",
        },
        {
          status: "RESCHEDULED",
        },
      ];

      var f = await Appointment.find(findStrings).count();

      console.log("follow:", f);

      res.send({
        success: true,
        today: t,
        week: w,
        follow: f,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: "No data Found",
      });
    }
  },

  search: async function (req, res) {
    try {
      var query = req.body.query;

      if (!query) throw new Error("query not found");

      var result = await User.find({ name: new RegExp(query, "i") }).lean();

      if (!result) throw new Error("no result");

      res.send({ data: result, success: true });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  },

  getUserByNumber: async function (req, res) {
    try {
      var number = req.body.number;
      var role = req.body.role;

      var result = await User.findOne({ number, role }).lean();
      if (!result) throw new Error();

      res.send({
        data: result,
        success: true,
      });
    } catch (error) {
      res.send({
        success: false,
      });
    }
  },

  mapDoctorAndClinic: async function (req, res) {
    try {
      var docId = req.body.docId;
      var clinicId = req.body.clinicId;

      var result1 = await User.update(
        { _id: docId },
        { $addToSet: { clinics: clinicId } }
      );

      var result2 = await User.update(
        { _id: clinicId },
        { $addToSet: { doctors: docId } }
      );

      res.send({
        success: true,
        data: { result1, result2 },
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  },

  removeMapping: async function (req, res) {
    try {
      var docId = req.body.docId;
      var clinicId = req.body.clinicId;

      var result1 = await User.update(
        { _id: docId },
        { $pull: { clinics: clinicId } }
      );

      var result2 = await User.update(
        { _id: clinicId },
        { $pull: { doctors: docId } }
      );

      res.send({
        data: { result1, result2 },
        success: true,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = cont;
