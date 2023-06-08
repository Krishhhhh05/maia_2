const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

var mongoConn = require("../../Database/mongoConn");

var appointments = mongoose.Schema(
  {
    appointmentNo: Number,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    bookingDate: {
      type: String,
    },
    slot: { type: Object },
    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4], //0-requested,1-confirmed,2-cancelled, 3-rescheduled, 4-converted
      default: 0,
    },
    remarks: String,
  },
  {
    timestamp: true,
    strict: false,
  }
);

appointments.plugin(autoIncrement.plugin, {
  model: "v2-appointment",
  field: "appointmentNo",
  startAt: 1,
});
appointments.statics = {
  async _edit(obj) {
    return this.findOneAndUpdate({ _id: obj._id }, obj, { new: true })
      .populate({
        path: "client",
      })
      .populate({
        path: "doctor",
        select: "name photo services",
      })
      .populate({
        path: "clinic",
        select: "name photo profile_photo services",
      });
  },
  async _delete(_id) {
    return this.findOneAndUpdate({ _id: _id }, { status: -1 }, { new: true })
      .populate({
        path: "client",
      })
      .populate({
        path: "doctor",
        select: "name photo services",
      })
      .populate({
        path: "clinic",
        select: "name photo profile_photo services",
      });
  },
};
// appointments.pre('save',async function (next) {
//     console.log('pre save',this);
//
//     if (this.isModified('status') && this.status==4){
//         console.log('------------------------appointment converted------------------------');
//     }
//     next();
// })
// appointments.post('findOneAndUpdate',async function (next) {
//     console.log('post findOneAndUpdate',this);
//
//     if (this.isModified('status') && this.status==4){
//         console.log('------------------------appointment converted------------------------');
//     }
//     next();
// })
module.exports = mongoose.model(
  "v2-appointment",
  appointments,
  "v2-appointment"
);
