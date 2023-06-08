const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var mongoConn = require('../../Database/mongoConn');

var appointments = mongoose.Schema({
    reqId: {type:String},
    userId:{type: mongoose.Schema.Types.ObjectId,ref:'user'},
    method: String,
    endpoint: String,
    query: String,
    params: String,
    body: String

}, {
    timestamp: true,
    strict: true,
});


appointments.statics = {
    async _edit(obj) {
        return this.findOneAndUpdate({_id: obj._id}, obj, {new: true})
    },
    async _delete(_id) {
        return this.findOneAndUpdate({_id: _id}, {status: -1}, {new: true})
    }
}
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
module.exports = mongoose.model('log_Model', appointments, 'log_Model');
