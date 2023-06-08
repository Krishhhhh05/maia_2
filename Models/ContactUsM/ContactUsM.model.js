const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var mongoConn = require('../../Database/mongoConn');

var appointments = mongoose.Schema({
    number: String,
    name: String,
    email: String,
    page_url: String,
    registered_date: Date
}, {
    strict: true,
    timestamp: true,
});
appointments.statics = {
    async _edit(obj) {
        return this.findOneAndUpdate({
            _id: obj._id
        }, obj, {
            new: true,
            upsert: true
        })
    },
    async _delete(_id) {
        return this.findOneAndRemove({
            _id
        })
    },
    async _getAll() {
        return this.find({})
    },
    async _getAllLeads() {
        return this.find({})
    },
    async _getLeadData() {
        return this.find({
            registered_date: {
                $lte: new Date(),
                $gte: new Date(new Date().setDate(new Date().getDate() - 1))
            }
        }, {
            number: 1,
            name: 1,
            email: 1,
            page_url: 1,
            registered_date: 1,
            _id: 0
        })
    },
    async _deleteAll() {
        return this.deleteMany({})
    }
}

module.exports = mongoose.model('contactUs', appointments, 'contactUs');

//clinic two way, forgetpassword:email password, cacheSearch,similar doctors