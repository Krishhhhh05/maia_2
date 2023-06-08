const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var mongoConn = require('../../Database/mongoConn');

var treatment_schema = mongoose.Schema({
    treatmentNo:{type:Number},
    // Converted- new Treatment object - appointment, time duration, service.name , cost, treatment status"-ongoing, -cancelled, -completed", payment status:"PENDING, COMPLETED",payment history:[{balance, date of payment, amount paid}]
    treatment_status:{
        type: String,
        lowercase:true,
        enum:[ 'ongoing','cancelled','completed']
    },
    payment_status:{
        type: String,
        lowercase:true,
        enum:[ 'pending','completed']
    },
    payment_history:[{
        balance: Number,
        dateOfPayment:String,
        paid:Number
    }],
    total_amount:{
        type:String,
        required:true,
    },
    timeDuration:{
      type:String
    },
    durationUnit:{
        type:String,
        lowercase:true,
        enum:["days", "weeks", "months", "years"]
    },
    serviceName :{
        type: String,
    },
    status:{
        type:Number,
        enum:[0,1,2], //0-hidden 1 - visible
        default:1
    },
    startDate:String,
    endDate:String,
    remarks:String,
    appointment : {type:mongoose.Schema.Types.ObjectID,ref:'v2-appointment'}

},{
    timestamp:true,
    strict : false,
});


treatment_schema.plugin(autoIncrement.plugin, {
    model: 'treatment',
    field: 'treatmentNo',
    startAt: 1,
});
treatment_schema.statics={
    async _edit(obj){
        return this.findOneAndUpdate({_id:obj._id},obj,{new:true})
    },
    async _delete(_id){
        return this.findOneAndUpdate({_id:_id},{status:-1},{new:true})
    }
}
module.exports = mongoose.model('treatment',treatment_schema,'treatment');
