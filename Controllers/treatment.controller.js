const model = require('../Models/treatment/treatment.model');
// const nc=require('../lib/notificationCotroller');
const {
    getResV3
} = require('../helpers/helper');
const router = require('express').Router();
router.route('/').get(main).put(main).post(main).delete(main);

async function main(req, res, next) {
    switch (req.method) {
        case 'GET': {
            try {
                let options = {}
                if (req.query.treatmentNo) {
                    options.treatmentNo = req.query.treatmentNo
                }
                if (req.query.treatment_status) {
                    options.treatment_status = req.query.treatment_status
                }
                if (req.query.status) {
                    options.status = req.query.status
                }
                if (req.query.payment_status) {
                    options.payment_status = req.query.payment_status
                }
                if (req.query.serviceName) {
                    options.serviceName = req.query.serviceName
                }


                let items = await model.find(options).populate({
                    path: 'appointment', populate:{path:'clinic',select:'name profile_picture photo'}
                }).populate({
                    path: 'appointment', populate:{path:'client',select:'name profile_picture photo'}
                }).populate({
                    path: 'appointment', populate:{path:'doctor',select:'name profile_picture photo'}
                });
                res.json(getResV3(items))

            } catch (e) {
                next(e)
            }
            break;
        }
        case 'PUT': {
            try {

                let item = await model._edit(req.body)
                res.json(getResV3(item))


            } catch (e) {
                next(e)
            }
            break;
        }
        case 'POST': {
            try {
                let item = await new model(req.body).save();
                res.json(getResV3(item))

            } catch (e) {
                next(e)
            }
            break;
        }
        case 'DELETE': {
            try {
                let item = await model._delete(req.query._id);
                res.json(getResV3(item))
            } catch (e) {
                next(e)
            }
            break;
        }
        default: {
            next(new Error("method not allowed"))
        }
    }
}

module.exports = router;
