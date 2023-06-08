//fie to save contact us (leads) data

const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name');
const model = require('../Models/ContactUsM/ContactUsM.model');
// const {getResV3}=require('../helpers/helper')
//stroe leads data for one day



let data = [];


const headingColumnNames = [
    "Name",
    "Email",
    "Phone",
    "page source",
    "Lead date"
]
//Write Column Title in Excel file
let headingColumnIndex = 1;
headingColumnNames.forEach(heading => {
    ws.cell(1, headingColumnIndex++)
        .string(heading)
});
//Write Data in Excel file
let rowIndex = 2;
data.forEach( record => {
    let columnIndex = 1;
    Object.keys(record ).forEach(columnName =>{
        ws.cell(rowIndex,columnIndex++)
            .string(record [columnName])
    });
    rowIndex++;
}); 
wb.write('contactData.xlsx');