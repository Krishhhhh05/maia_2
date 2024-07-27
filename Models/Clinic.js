const mongoose = require('mongoose');

var mongoConn = require('../Database/mongoConn');

var clinic = mongoose.Schema({
        "email":"",//unique
        "doctors":[], //minimum 3 doctor is suggested
        "clinics":[], //not sure but not removing it
        "name":"lotus hospital", 
        "logo":[], 
        "fee":0, //avg fees 
        "popularity":0, //star ratings
        "beds":0, //no of beds
        "roll_number":"100", //i think unique id?
        "role":"CLINIC",
        "phoneNumbers": [919999849999], //unique
                "addresses": [
                  {
                     "countryCode": "in",
                     "city": "city_field_value",
                     "street": "street_field_value",
                     "zipcode": "1234567"
                  }
                ],
        "services":["surrogacy", "ivf"], //should be standard. 
        "images":[] //ambience images
        
},{
    strict : false,
});

module.exports = mongoose.model('clinic',clinic,'clinic');