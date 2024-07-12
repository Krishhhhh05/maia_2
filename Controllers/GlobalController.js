var User = require("../Models/User");
var Client = require("../Models/Clients");
var Clinic = require("../Models/Clinic");
var homeTreatment = require("../Models/treatment/treatment.model");

const request = require("request-promise");
var _ = require("underscore");
var Appointments = require("../Models/Appointments");
var v2_appointments = require("../Models/appointmentsv2/v2_appointments");
var multer = require("multer");
var keys = require("../Config/keys");
var tinified = require("tinify");
tinified.key = keys.tinifyKey;

const nodemailer = require("nodemailer");
var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: keys.cloudinaryCloudName,
  api_key: keys.cloudinaryApiKey,
  api_secret: keys.cloudinaryApiSecret,
});

var msg91Key = keys.msg91key;
var imageMimeType = ["image/jpeg", "image/png"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).array("profileImage", 5);

var { DoctorStatus, DocCategories } = require("../Config/statuses");

const sgMail = require("@sendgrid/mail");
const { uniq, unique } = require("underscore");
sgMail.setApiKey(require("../Config/keys").sendGridApiKey);

var cont = {
  getAllUsers: async function (req, res) {
    var body = req.body;
    try {
      var findString = {};
      findString["visible"] = 1;

      if (body.role) findString["role"] = body.role;
      if (body.status) findString["status"] = body.status;
      if (body.query) findString["name"] = new RegExp(body.query, "i");

      console.log("findstring", JSON.stringify(findString, null, 3));
      if (!findString["role"]) {
        var result = await User.find(findString)
          .populate("clinics")
          .populate("doctors")
          .lean();
      } else if (body.role == "DOCTOR") {
        var result = await User.find(findString).populate("doctors").lean();
      } else if (body.role == "CLINIC") {
        var result = await User.find(findString).populate("clinics").lean();
      }
      console.log("res", result.length);

      res.send({
        success: true,
        length: result.length,
        data: result,
        status: findString["status"],
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  getAllDeletedUsers: async function (req, res) {
    var body = req.body;
    try {
      var findString = {};
      findString["visible"] = 0;

      if (body.role) findString["role"] = body.role;
      if (body.status) findString["status"] = body.status;
      if (body.query) findString["name"] = new RegExp(body.query, "i");

      console.log("findstring", JSON.stringify(findString, null, 3));
      if (!findString["role"]) {
        var result = await User.find(findString)
          .populate("clinics")
          .populate("doctors")
          .lean();
      } else if (body.role == "DOCTOR") {
        var result = await User.find(findString).populate("doctors").lean();
      } else if (body.role == "CLINIC") {
        var result = await User.find(findString).populate("clinics").lean();
      }
      console.log("res", result.length);

      res.send({
        success: true,
        length: result.length,
        data: result,
        status: findString["status"],
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  getUserById: async function (req, res) {
    try {
      var result = await User.findOne({
        _id: Object(req.body.id),
      }).lean();
      console.log("res", result);

      res.send({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  update: async function (req, res) {
    var body = req.body;

    try {
      var updateString = {};
      var id = body.id;

      if (id) {
        //update document

        updateString = body;
        delete updateString["id"];
        if (body.name) updateString["name"] = body.name;
        if (body.number) updateString["number"] = body.number;
        if (body.status) updateString["status"] = body.status;

        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await User.updateMany(
          {
            _id: Object(id),
          },
          {
            $set: updateString,
          }
        );
      } else {
        // create new document
        console.log("inside create new document");

        var result = await User.create(body);
      }
      console.log("res", result);

      res.send({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  uploadFile: async function (req, res) {
    try {
      allFiles = [];
      url2 = req.protocol + "://" + req.get("host");

      // var i = productImage
      // console.log("i:"+i)
      // await upload.single('productImage')
      // console.log("u:"+u)
      upload(req, res, async function (err) {
        try {
          console.log("pathOfFile", JSON.stringify(req.file));
          console.log("pathOfFile", JSON.stringify(req.files));

          if (err) {
            console.log("upload err ", err);
            throw err;
          } else {
            for (i = 0; i < req.files.length; i++) {
              if (_.contains(imageMimeType, req.files[i].mimetype)) {
                var source = tinified.fromFile(req.files[i].path);
                source.toFile(req.files[i].path);
              }

              allFiles[i] = await cloudinaryUpload(req.files[i]);
            }
            res.json({
              success: true,
              message: "File Uploaded",
              link: allFiles,
            });
          }
        } catch (err) {
          res.json({
            success: false,
            message: err.message,
          });
        }
      });

      // console.log("file:"+req.file);`
    } catch (err) {
      res.json({
        success: false,
        message: err.message,
      });
    }
  },
  getAllAppointments: async function (req, res) {
    var body = req.body;

    try {
      var findString = {};
      if (body.role) findString["role"] = body.role;
      if (body.status) findString["status"] = body.status;

      console.log("findstring", JSON.stringify(findString, null, 3));

      var result = await Appointments.find(findString)
        .populate("doctor", ["name", "number", "photo"])
        .populate("client", ["name", "number", "photo"])
        .populate("clinic", "clinic.clinicName")
        .lean();
      console.log("res", JSON.stringify(result, undefined, 3));
      console.log("len:" + result.length);

      res.send({
        success: true,
        length: result.length,
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  getAppointments: async function (req, res) {
    var pageSize = 25;
    var pageNo = req.body.pageNo;
    var status = req.body.status;
    var type = req.body.type;

    var findString = {};

    if (status) findString["status"] = status;

    try {
      if (type === "TODAY") {
        var start = new Date();
        start.setHours(0, 0, 0, 0);

        var end = new Date();
        end.setHours(23, 59, 59, 999);

        findString["registeredOn"] = {
          $gte: start.getTime(),
          $lte: end.getTime(),
        };
      } else if (type === "WEEK") {
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
      } else if (type === "FOLLOW_UP") {
        let day = new Date();

        findString["$or"] = [
          {
            registeredOn: {
              $lte: day.getTime(),
            },
            status: "SCHEDULED",
          },
          {
            status: "RESCHEDULED",
          },
        ];
        // findString['registeredOn']={'$lte': today.getTime()};
        // findString['status'] = {'$in':['RESCHEDULED','SCHEDULED']};
      }

      console.log(
        "findstring appointment",
        JSON.stringify(findString, null, 3)
      );

      var result = await Appointments.find(findString);
      populate("doctor", "name availability")
        .populate("clinic", "clinic.clinicName")
        .populate("client")
        .lean();

      res.send({
        success: true,
        length: result.length,
        nextPage: result.length === pageSize ? true : false,
        type: type ? type : "ALL",
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  updateAppointment: async function (req, res) {
    var body = req.body;

    try {
      var updateString = {};
      var id = body.id;

      if (id) {
        //update document

        updateString = body;
        delete updateString["id"];

        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await Appointments.updateMany(
          {
            _id: Object(id),
          },
          {
            $set: updateString,
          }
        );
      } else {
        // create new document
        console.log("inside create new document");

        var result = await Appointments.create(body);
      }
      console.log("res", result);

      res.send({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  addNewDoctorUsingCrm: async function (req, res, next) {
    try {
      const body = req.body;

      const doctor = {
        visible: 1,
        photo: "",
        name: "",
        gender: "",
        business_type: "",
        contact_no: "",
        email: "",
        dob: "",
        experience_years: "",
        biography: "",
        title: [],
        fee: "0",
        services: [],
        specialization: [],
        registartions: [],
        education: [],
        experience: [],
        awards: [],
        role: "DOCTOR",
        clinics: [],
        memberships: [],
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        },
        ...body,
      };
      doctor.registeredOn = Date.now();

      console.log(doctor);

      const result = await User.create(doctor);

      res.locals.doctor = result;
      // if (body.send_text) sendSms(result._id, result.number, "DOCTOR");

      // if (body.send_email) sendEmail(result);

      res.json({
        success: true,
        result: result._id,
        message: "Vendor Registered Successfully",
      });
    } catch (err) {
      res.json({
        success: false,
        message: err,
      });
    }
  },
  addNewClinicUsingCrm: async function (req, res, next) {
    try {
      var body = req.body;
      var clinic = body;
      console.log(body);

      console.log("\n");
      if (!body.roll_number || body.roll_number == "") {
        res.send({
          success: false,
          message: "Roll Number Is Required",
        });
      }
      clinic.role = "CLINIC";
      clinic.registeredOn = Date.now();
      var c = await User.findOne({
        number: body.roll_number,
        role: "CLINIC",
        visible: 1,
      });

      console.log(c);
      if (!c) {
        var result = await User.create(clinic);
        res.locals.clinic = result;
        res.json({
          success: true,
          result: result._id,
          clinic: result,
          message: "Clinic Added",
        });
      } else {
        console.log("Clinic's Add");

        res.json({
          success: false,
          result: c._id,
          clinic: c,
          message: "Clinic Already Exists",
        });
      }
    } catch (err) {
      res.send({
        success: false,
        message: err,
      });
    }
  },
  hideUser: async function (req, res) {
    var body = req.body;

    try {
      var updateString = {};
      var id = body.id;
      console.log(id);

      if (id) {
        //update document

        updateString = body;
        updateString["visible"] = 0;
        delete updateString["id"];

        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await User.updateMany(
          {
            _id: Object(id),
          },
          {
            $set: updateString,
          }
        );
      } else {
        // create new document
        console.log("inside create new document");

        var result = await User.create(body);
      }
      console.log("res", result);

      res.send({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
 getClinic: async function (req, res) {
  console.log(req.body);

  try {
    var result = await User.findOne({
      _id: Object(req.body.id),
    }).lean();
    console.log("res", result);
    var allDoctors = [];

    if (result.doctors && result.doctors.length > 0) {
      let doctorIds = [...new Set(result.doctors)];
      console.log("doctorIds", doctorIds);

      // let doctors = await User.find({
      //   _id: Object(doctorIds[0]),  
      // }).lean();

      let doctors = await User.find({
        _id: { $in: doctorIds }
      }).lean();
      
      res.doctors_found = doctors;

      if (doctorIds.length === doctors.length) {
        console.log("All doctors found");
      } else {
        console.log("Some doctors not found, updating doctor list");
        result.doctors = doctors.map((c) => c._id);
      }
      allDoctors = doctors;
    }

    res.send({
      success: true,
      data: result,
      doctors: allDoctors,
    });
  } catch (error) {
    console.log("err", error);
    res.send({
      success: false,
      msg: error.message,
    });
  }
},

  showUser: async function (req, res) {
    var body = req.body;

    try {
      var updateString = {};
      var id = body.id;
      console.log(id);

      if (id) {
        //update document

        updateString = body;
        updateString["visible"] = 1;
        delete updateString["id"];

        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await User.updateMany(
          {
            _id: Object(id),
          },
          {
            $set: updateString,
          }
        );
      } else {
        // create new document
        console.log("inside create new document");
        var result = await User.create(body);
      }
      console.log("res", result);

      res.send({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  getAllClients: async function (req, res) {
    var pageSize = 25;
    var body = req.body;
    var pageNo = body.pageNo;

    try {
      var findString = {};

      if (body.doctor) findString["doctor"] = body.doctor;
      if (body.status) findString["status"] = body.status;
      if (body.query) findString["name"] = new RegExp(body.query, "i");

      console.log("findstring", JSON.stringify(findString, null, 3));

      var result = await Client.find(findString);
      // populate("doctor").lean();
      console.log("res", result.length);

      res.send({
        success: true,
        length: result.length,
        nextPage: result.length === pageSize ? true : false,
        data: result,
        status: findString["status"],
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },

  getAllPatients: async function (req, res) {
    try {
      var findString = {
        role: "CLIENT",
      };
      var result = await Client.find(findString);
      console.log("res", result.length);

      res.send({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  getClient: async function (req, res) {
    try {
      console.log("req ", req.body);

      if (req.body.id) {
        var result = await Client.findOne({
          _id: Object(req.body.id),
        }).lean();
      } else {
        var result = await Client.findOne(req.body).lean();
      }

      console.log("Client res ", result);

      res.send({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  updateClient: async function (req, res) {
    var body = req.body;

    try {
      var updateString = {};
      var id = body.id;

      if (id) {
        //update document

        updateString = body;
        delete updateString["id"];

        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await Client.updateMany(
          {
            _id: Object(id),
          },
          {
            $set: updateString,
          }
        );
      } else {
        // create new document
        console.log("inside create new document");

        var result = await Client.create(body);
      }
      console.log("res", result);

      res.send({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  sendSms: async function (req, res) {
    try {
      var id = res.locals.clinic._id;
      console.log(res.locals.clinic);

      var message = `Click on the link to complete your registration. http://www.vendor.maia.care/clinic-register.html?id=${id}`;
      var number = res.locals.clinic.number;
      var options = {
        url: "https://api.msg91.com/api/v2/sendsms?country=91",
        body: {
          sender: "SOCKET",
          route: "4",
          country: "91",
          sms: [
            {
              message: message,
              to: [number],
            },
          ],
        },
        json: true,
        headers: {
          authkey: msg91Key,
          "content-type": "application/json",
        },
      };

      console.log(options);

      var response = await request.post(options);

      console.log("res ", JSON.stringify(response));
      res.json({
        clinic: res.locals.clinic,
        result: res.locals.clinic._id,
        success: true,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  },
  sendSendGrid: async function (req, res) {
    try {
      let { to, from, subject, text, html } = req.body;

      const msg = {
        to,
        from,
        subject,
        text,
        html,
        // personalizations:[{
        //     dynamic_template_data:{
        //         name:'aman'
        //     },
        // }],
        template_id: "d-5ef7bd018d184bcc9a5b82c9795ffb54",
      };

      let sent = await sgMail.send(msg);

      res.send({
        success: true,
        data: sent,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  trueCallback: async function (req, res) {
    try {
      // sample body
      // {"requestId":"RL8YZ41FQMt5Jiak2sc_Ys0OgQA=","accessToken":"a1asX--8_yw-OF--E6Gj_DPyKelJIGUUeYB9U9MJhyeu4hOCbrl","endpoint":"https://profile4-noneu.truecaller.com/v1/default"}

      console.log("true callback", req.body);

      var options = {
        url: req.body.endpoint,
        headers: {
          Authorization: `Bearer ${req.body.accessToken}`,
          "Cache-Control": "no-cache",
        },
      };

      let response = await request.get(options);

      response = JSON.parse(response);
      console.log("truecaller response ", response);

      // let array = response['phoneNumbers'];
      console.log("array ...", response.phoneNumbers[0]);

      // if(!Array.isArray(array)) throw new Error('not a array');

      let result = await Client.findOne({
        number: {
          $in: response.phoneNumbers,
        },
      }).lean();

      if (!result) {
        // not registered
        console.log("not resgistered ");

        let newClient = {
          name: response.name.first + " " + response.name.last,
          number: response.phoneNumbers[0],
          gender: response.gender,
          city: response.addresses.city,
          pincode: response.addresses.zipcode,
          profile_photo: response.avatarUrl,
          status: "VERIFIED",
          role: "CLIENT",
          trueRequestId: req.body.requestId,
        };

        result = await Client.create(newClient);

        console.log("create res ", result);
      } else {
        //registered

        let update = await Client.updateOne(
          {
            _id: Object(result._id),
          },
          {
            $set: {
              trueRequestId: req.body.requestId,
            },
          }
        );
      }

      // {
      //     "phoneNumbers": [919999999999],
      //     "addresses": [
      //       {
      //          "countryCode": "in",
      //          "city": "city_field_value",
      //          "street": "street_field_value",
      //          "zipcode": "1234567"
      //       }
      //     ],
      //     "avatarUrl": "https://s3-eu-west-1.amazonaws.com/images1.truecaller.com/myview/1/15a999e9806gh73834c87aaa0498020d/3",
      //     "aboutMe":"About me",
      //     "jobTitle": "CEO",
      //     "companyName": "ABC",
      //     "history": {
      //       "name":
      //       {
      //         "updateTime": "1508089888000"
      //       }
      //     },
      //     "isActive": "True",
      //     "gender": "Male",
      //     "createdTime": "1379314068000",
      //     "onlineIdentities": {
      //       "url": "https://www.truecaller.com",
      //       "email": "y.s@truecaller.com",
      //       "facebookId":"105056625245",
      //     },
      //     "type": "Personal",
      //     "id": "655574719",
      //     "userId":"1319413476",
      //     "badges": ["verified", "premium"],
      //     "name": {
      //       "last": "Kapoor",
      //       "first": "Rajat"
      //     }
      //   }
    } catch (error) {
      console.log("err", error);
    }
  },

  sanitizaObject: async function (req, resp) {
    var result = await User.find({
      _id: req.body.id,
    });
    var object = result[0];
    var res = {
      success: true,
      old_object: object,
    };
    if (object.role == "DOCTOR") {
      // object.clinics = ;
      let clinics = await User.find({
        _id: {
          $in: [...new Set(object.clinics)],
        },
        visible: 1,
      });
      res.clinics_found = clinics;
      if (object.clinics.length == clinics.length) {
        console.log("Cinics work");
      } else {
        object.clinics = clinics.map((c) => c._id);
      }
    } else {
      let doctors = await User.find({
        _id: {
          $in: [...new Set(object.doctors)],
        },
        visible: 1,
      });
      res.doctors_found = doctors;
      if (object.doctors.length == doctors.length) {
        console.log("doctors work");
      } else {
        object.doctors = doctors.map((c) => c._id);
      }
    }
    res.new_object = object;
    resp.send(res);
  },
  sanitizaAll: async function (req, resp) {
    var result = await User.find({
      visible: 1,
      status: "Verified",
    });

    var upadated = [];
    for (let i = 0; i < result.length; i++) {
      object = result[i];
      var doc_ids = [],
        clinic_ids = [];

      var doctors = object.doctors,
        clinics = object.clinics;

      doc_ids = doctors.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      });
      clinic_ids = clinics.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      });

      object.doctors = doc_ids;
      object.clinics = clinic_ids;
      upadated[i] = object;

      var result_data = await User.updateMany(
        {
          _id: Object(object.id),
        },
        {
          $set: {
            doctors: doc_ids,
            clinics: clinic_ids,
          },
        }
      );
    }
  },
  sanitizaAll: async function (req, resp) {
    var result = await User.find({
      visible: 1,
      status: "Verified",
    });

    var upadated = [];
    for (let i = 0; i < result.length; i++) {
      object = result[i];
      var doc_ids = [],
        clinic_ids = [];

      var doctors = object.doctors,
        clinics = object.clinics;

      doc_ids = doctors.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      });
      clinic_ids = clinics.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      });

      object.doctors = doc_ids;
      object.clinics = clinic_ids;
      upadated[i] = object;

      var result_data = await User.updateMany(
        {
          _id: Object(object.id),
        },
        {
          $set: {
            doctors: doc_ids,
            clinics: clinic_ids,
          },
        }
      );
    }

    resp.send({
      old: result,
      new: upadated,
    });
  },
  cleanV2Appointments: async function (req, res) {
    try {
      var cleanedAppointments = await v2_appointments.remove();
      console.log(cleanedAppointments);
      res.send({
        sucess: true,
        data: cleanedAppointments,
      });
    } catch (error) {
      res.send({
        success: false,
      });
    }
  },
  cleanClients: async function (req, res) {
    try {
      var cleanedClients = await Client.remove();
      res.send({
        sucess: true,
        data: cleanedClients,
      });
    } catch (error) {
      res.send({
        success: false,
      });
    }
  },
  cleanTreatments: async function (req, res) {
    try {
      var cleanedTreatments = await homeTreatment.remove();
      console.log(cleanedTreatments);
      res.send({
        sucess: true,
        data: cleanedTreatments,
      });
    } catch (error) {
      res.send({
        success: false,
      });
    }
  },
};

function cloudinaryUpload(file) {
  return new Promise((resolve, reject) => {
    console.log("hey inside", JSON.stringify(file));
    cloudinary.uploader.upload(file.path, function (result) {
      if (result.secure_url) {
        var coverImageURL = result.secure_url;

        // var cloud_version = 'v'+result.version;
        console.log("Result : " + JSON.stringify(result));
        resolve(coverImageURL);
      } else {
        console.log("Inside Error");

        reject("Error");
      }
    });
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function sendEmail(user) {
  const html = `Hey, Welcome aboard. Here is the link to complete your Registration https://vendor.maia.care/profile/${role.toLowerCase()}-profile.html?id=${id}`;
  const from_email = "info@maia.care";
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    auth: {
      type: "OAuth2",
      user: from_email,
      serviceClient: keys.gsuite_client,
      privateKey: keys.gsuite_private_key,
    },
  });

  console.log("In Send Mail");

  const mailOptions = {
    from: from_email,
    to: user.email,
    subject: "Welcome to On Your Door Services",
    text: html,
    html: html,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

async function sendSms(id, number, role) {
  try {
    const message = `Hey, Welcome aboard. Here is the link to complete your Registration https://vendor.maia.care/profile/${role.toLowerCase()}-profile.html?id=${id}`;
    const options = {
      url: "https://api.msg91.com/api/v2/sendsms?country=91",
      body: {
        sender: "SOCKET",
        route: "4",
        country: "91",
        sms: [
          {
            message: message,
            to: [number],
          },
        ],
      },
      json: true,
      headers: {
        authkey: msg91Key,
        "content-type": "application/json",
      },
    };

    const response = await request.post(options);

    console.log("res ", JSON.stringify(response));
    res.json({
      clinic: res.locals.clinic,
      result: res.locals.clinic._id,
      success: true,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
}
module.exports = cont;
