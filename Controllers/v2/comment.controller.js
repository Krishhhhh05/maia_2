const router = require("express").Router();
var moment = require("moment");

const model = require("../../Models/Comment");
const { getResV3 } = require("../../helpers/helper");
const { COMMENT_STATUS } = require("../../utils/constants");

router.route("/").get(main).put(main).post(main).delete(main);

async function main(req, res, next) {
  switch (req.method) {
    case "GET": {
      try {
        let options = {};
        if (req.query.commentOn) {
          options.commentOn = req.query.commentOn;
        }
        let items = await model
          .find(options)
          .sort("createdAt")
          .populate({
            path: "commentBy",
            select: "name profile_photo number email",
          })
          .populate({
            path: "commentOn",
            select: "name profile_photo photo",
          })
          .lean();
        const comments = items.map((item) => {
          return {
            ...item,
            date: moment(item.createdAt).fromNow(),
          };
        });

        res.json(getResV3(comments));
      } catch (e) {
        next(e);
      }
      break;
    }
    case "PUT": {
      try {
        let item = await model._edit(req.body);
        res.json(getResV3(item));
      } catch (e) {
        next(e);
      }
      break;
    }
    case "POST": {
      try {
        const item = await new model(req.body).save();
        res.json(getResV3(item));
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
