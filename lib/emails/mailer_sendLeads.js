const myMail = 'no-reply@velaarhealth.com';
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
const fs = require("fs");
const path = require('path');

let mailer = {};

let key = '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';
sgMail.setApiKey(key);

mailer.sendLead = (empty) => {
  var msg = {}
  if (!empty) {
    var pathToAttachment = path.join(__basedir, '/leads.xlsx');
    msg = {
      to: 'snehal@maia.care',
      cc: 'technology@maia.care',
      from: myMail,
      subject: 'Leads from Website' + new moment().format('MMMM Do YYYY'),
      text: 'Hey Snehal Please Find the Attachment',
      attachments: [{
        content: fs.readFileSync(pathToAttachment).toString("base64"),
        filename: "leads.xlsx",
        type: "application/xlsx",
        disposition: "attachment"
      }]
    };
  } else {
    msg = {
      to: 'snehal@maia.care',
      cc: 'technology@maia.care',
      from: myMail,
      subject: 'Leads from Website' + new moment().format('MMMM Do YYYY'),
      text: 'Hey Snehal There are no leads available for the day',
    };
  }
  const msgResult = sgMail.send(msg)
    .then(() => {
      console.log('mail sent sucess');
    })
    .catch(err => {
      console.log(err);
    });
}

mailer.sendAllLead = (empty) => {
  var msg = {}
  if (!empty) {
    var pathToAttachment = path.join(__basedir, '/allLeads.xlsx');
    msg = {
      to: 'snehal@maia.care',
      cc: 'technology@maia.care',
      from: myMail,
      subject: 'Leads from Website till' + new moment().format('MMMM Do YYYY'),
      text: 'Hey Snehal Please Find the Attachment',
      attachments: [{
        content: fs.readFileSync(pathToAttachment).toString("base64"),
        filename: "allLeads.xlsx",
        type: "application/xlsx",
        disposition: "attachment"
      }]
    };
  } else {
    msg = {
      to: 'snehal@maia.care',
      cc: 'technology@maia.care',
      from: myMail,
      subject: 'Leads from Website till' + new moment().format('MMMM Do YYYY'),
      text: 'Hey Snehal There are no leads available for the day',
    };
  }
  const msgResult = sgMail.send(msg)
    .then(() => {
      console.log('mail sent sucess');
    })
    .catch(err => {
      console.log(err);
    });
}


module.exports = mailer