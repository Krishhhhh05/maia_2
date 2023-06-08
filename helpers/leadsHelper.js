const mailer = require('../lib/emails/mailer_sendLeads');
const moment = require('moment');
const ExcelJS = require('exceljs');




let helper = {
  "getLeads": (data) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Website');
    sheet.columns = [{
        header: 'Name',
        key: 'name',
        width: 10
      },
      {
        header: 'Number',
        key: 'number',
        width: 15
      },
      {
        header: 'Email',
        key: 'email',
        width: 15,
      },
      {
        header: 'Page Source',
        key: 'page_url',
        width: 15,
      },
      {
        header: 'Lead Registration Date',
        key: 'registered_date',
        width: 32,
      }
    ];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      element.registered_date = moment(element.registered_date).format('DD-MM-YYYY h:mm:ss a').toString();
      sheet.addRow(element);
    }
    console.log(data.length)
    var empty = (data.length > 0) ? true : false;

    console.log(empty)
    workbook.xlsx.writeFile('allLeads.xlsx').then(() => {
      return mailer.sendAllLead(!empty);
    })
  },
  "getWebsiteLeads": (data) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Website');
    sheet.columns = [{
        header: 'Name',
        key: 'name',
        width: 10
      },
      {
        header: 'Number',
        key: 'number',
        width: 15
      },
      {
        header: 'Email',
        key: 'email',
        width: 15,
      },
      {
        header: 'Page Source',
        key: 'page_url',
        width: 15,
      },
      {
        header: 'Lead Registration Date',
        key: 'registered_date',
        width: 32,
      }
    ];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      element.registered_date = moment(element.registered_date).format('DD-MM-YYYY h:mm:ss a').toString();
      sheet.addRow(element);
    }
    var empty = (data.length > 0) ? true : false;
    workbook.xlsx.writeFile('leads.xlsx').then(() => {
      return mailer.sendLead(!empty);
    })
  }

}


module.exports = helper;