var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var path = require('path');
var uuid = require('node-uuid');
const dotenv = require('dotenv');

let envPath = '.env';

if(process.env.NODE_ENV) envPath = `.env.${process.env.NODE_ENV}`

console.log(envPath);

dotenv.config({
  path: envPath,
}); 


var indexRouter = require('./Routes/indexRouter');
var authRouter = require('./Routes/authRouter');
var manageRouter = require('./Routes/manageRouter');
var doctorRouter = require('./Routes/doctorRouter');
var partnerRouter = require('./Routes/partnerRouter');

const logM=require('./Models/logModel/logModel');
// var doctorRouter = require('./Routes/doctorRouter');

var {verifyUser} = require('./Controllers/authController');
// var {dashboard} = require('./Controllers/doctorController');

var app = express();
app.use(morgan('dev'));
//app.use(function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    next();
//  });
  
app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    let id = uuid.v4()
    req.rId = id;
    req.userId = req.headers.userid;
    new logM({
        reqId: req.rId,
        method: req.method,
        userId:req.userId?req.userId:null,
        endpoint: req.originalUrl.split('?')[0],
        query: JSON.stringify(req.query),
        params: JSON.stringify(req.params),
        body: JSON.stringify(req.body)
    }).save();
    next();
});

global.__basedir = __dirname;


app.use('/uploads',express.static('uploads'))

var db = require('./Database/mongoConn');
// app.use(express.static(__dirname));

//token checking middleware
app.use('/',indexRouter);

app.use('/auth',authRouter);
app.use('/doctor',doctorRouter);
app.use('/partner',partnerRouter);
app.use('/manage',manageRouter);
app.use('/common',require('./Routes/commonRoute'));
app.use('/apis/v1/appointments', require('./Controllers/appointment.controller'));

app.use('/apis/v1/users', require('./Controllers/user.controller'));
app.use('/apis/v1/treatment', require('./Controllers/treatment.controller'));
// app.use('/uploads', express.static('uploads'));

//v2 apis
app.use('/apis/v2/website',require("./Routes/v2/index.router"));

//keep it at last]
app.use(require('./helpers/errorHandler'));



app.listen(process.env.PORT , function() {
    console.log("Express server listening on port " + process.env.PORT);
});      
