const sgMail = require('@sendgrid/mail');
let mailer = {};
//Email From which the mails would be sent
const myMail = `no-reply@gadigoda.com`;

let key = 'SENDGRIDKEY';
sgMail.setApiKey(key);
mailer.templates = {
    "booking_create": '',
    "booking_confirm": '',
    "booking": '',
    "register": '',
}
const mailObject = {
    toEmailId: null,
    tempId: null,
    subject: null,
    tempData: null
};
mailer.mailObject = o => Object.assign(o, mailObject)
mailer.sendEmailSendGrid = async (data) => {
    console.log("sending mail",JSON.stringify(data));
    const msg = {
        to: data.toEmailId,
        from: {email: myMail, name: "Gadi Goda"},
        template_id: data.tempId,
        dynamic_template_data: data.tempData,
        subject: data.subject
    };
    // console.log(msg);
    await sgMail.send(msg)
};
mailer.sendMailPlain = async (data) => {
    console.log("sending mail");
    const msg = {
        to: data.toEmailId,
        from: {email: myMail, name: "GadiGoda"},
        subject: data.subject,
        text: data.text
    };
    // console.log(msg);
    await sgMail.send(msg)
};


module.exports = mailer;
