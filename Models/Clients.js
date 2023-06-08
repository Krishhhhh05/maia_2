const mongoose = require("mongoose");

var mongoConn = require("../Database/mongoConn");

var client = mongoose.Schema(
  {
    visible: {
      type: Number,
      default: 1,
    },
    name: String,
    email: String,
    profile_photo: String,
    number: String,
    age: String,
    gender: String,
    status: String,
    address: {
      street: String,
      state: String,
      city: String,
      zipcode: String,
    },
  },
  {
    timestamp: true,
    strict: false,
  }
);

client.statics = {
  async _edit(obj) {
    return this.findOneAndUpdate({ _id: obj._id }, obj, { new: true });
  },
  async _delete(_id) {
    return this.findOneAndUpdate({ _id: _id }, { visible: 0 }, { new: true });
  },
};

client.pre("save", function (next) {
  this.wasNew = this.isNew;
  next();
});
client.post("save", function () {
  console.log("saved doc", this);
  if (this.wasNew) {
    console.log("Sending email");
    require("../lib/notificationCotroller").onNewRegister(this);
  }
});

module.exports = mongoose.model("clients", client, "clients");
