const model = require("../Models/Clients");
const nc = require("../lib/notificationCotroller");
const { getResV3 } = require("../helpers/helper");
const router = require("express").Router();
router.route("/").get(main).put(main).post(main).delete(main);

async function main(req, res, next) {
  switch (req.method) {
    case "GET": {
      try {
        let options = {
          role: "CLIENT",
        };
        if (req.query.email) {
          options.email = req.query.email;
        }
        if (req.query.number) {
          options.number = req.query.number;
        }
        if (req.query.status) {
          options.status = req.query.status;
        }
        if (req.query.name) {
          options.name = req.query.name;
        }

        let items = await model.find(options);
        res.json(getResV3(items));
      } catch (e) {
        next(e);
      }
      break;
    }
    case "PUT": {
      try {
        let item = await model._edit(req.body);
        res.json(getResV3(item));
        if (item.status == 1) {
          nc.onNewAppointmentApproved(item);
        }
        if (item.status == 2) {
          nc.onNewAppointmentCancelled(item);
        }
        if (item.status == 3) {
          nc.onAppointmentRescheduled(item);
        }
      } catch (e) {
        next(e);
      }
      break;
    }
    case "POST": {
      try {
        let item = await new model(req.body).save();
        res.json(getResV3(item));
        nc.onNewAppointment(item);
      } catch (e) {
        next(e);
      }
      break;
    }
    case "DELETE": {
      try {
        let item = await model._delete(req.query._id);
        res.json(getResV3(item));
      } catch (e) {
        next(e);
      }
      break;
    }
    default: {
      next(new Error("method not allowed"));
    }
  }
}

module.exports = router;
