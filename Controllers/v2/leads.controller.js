const model = require('../../Models/ContactUsM/ContactUsM.model');
const helper = require('../../helpers/leadsHelper')
const router = require('express').Router();
router.route('/').get(main);
router.route('/getWebsiteLeads').get(getWebsiteLeads);


async function main(req, res, next) {
    switch (req.method) {
        case 'GET': {
            try {
                let items = await model._getAllLeads();
                // console.log(items)
                helper.getLeads(items)
                res.json({
                    'Mail Status': 'Sent. Expect an email from no-reply@velaarhealth.com'
                })
            } catch (e) {
                next(e);
            }
            break;
        }
        default: {
            next(new Error("method not allowed"))
        }
    }
}

async function getWebsiteLeads(req, res, next) {
    switch (req.method) {
        case 'GET': {
            try {
                let items = await model._getLeadData();
                console.log(items)
                helper.getWebsiteLeads(items);
                res.json({
                    'Mail Status': 'Sent. Expect an email from no-reply@velaarhealth.com'
                })
            } catch (e) {
                next(e);
            }
            break;
        }
        default: {
            next(new Error("method not allowed"))
        }
    }
}
module.exports = router;