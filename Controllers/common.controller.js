const path = require('path');
var multer = require('multer');
var tinified = require("tinify");
const request = require('request-promise');
var cloudinary = require('cloudinary');
var _ = require('underscore');

var keys = require('../Config/keys');
var User = require('../Models/User');
var Clinics = require('../Models/Clinic');
var Doctor = require('../Models/Doctor');
const Appointments = require('../Models/Appointments');
const {getResV3} = require('../helpers/helper')
let controller = {};
// controller.verify=async function(req,res,next){
//     try{
//
//     }catch (e) {
//         next(e)
//     }
// }
controller.verify = async function (req, res, next) {
    try {
        let body = req.body,
            id = body._id;
            // type = body.type;
        delete body._id;
        // delete body.type;
        // type = type.toString().toUpperCase();
        let result = {};
        // console.log(body,type,id);
        result = await User.findOneAndUpdate({_id: id}, body, {new: true});
        res.json(getResV3(result));


        // switch (type) {
        //     case 'DOCTOR': {
        //         result = await User.findOneAndUpdate({_id: id}, body, {new: true});
        //         console.log(result);
        //         res.json(getResV3(result));
        //         break;
        //     }
        //     case 'CLINIC': {
        //         result = await User.findOneAndUpdate({_id: id}, body, {new: true});
        //         res.json(getResV3(result));
        //         console.log(result);
        //
        //         break;
        //     }
        //     default: {
        //         next(new Error("invalid type parameter sent"))
        //         break;
        //     }
        // }

    } catch (e) {
        next(e)
    }
}


module.exports = controller
