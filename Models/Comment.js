const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

var mongoConn = require("../Database/mongoConn");
const { COMMENT_STATUS } = require("../utils/constants");

var comment = mongoose.Schema(
  {
    commentNo: Number,
    commentOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    comment: String,
    rating: {
      type: String,
      default: "3",
    },
    attachments: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(COMMENT_STATUS),
      default: COMMENT_STATUS.PENDING,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);
comment.plugin(autoIncrement.plugin, {
  model: "comment",
  field: "commentNo",
  startAt: 1,
});
comment.statics = {
  async _edit(obj) {
    return this.findOneAndUpdate({ _id: obj._id }, obj, {
      new: true,
      upsert: true,
    });
  },
  async _delete(_id) {
    return this.findOneAndRemove({ _id });
  },
};
module.exports = mongoose.model("comment", comment, "comment");
