var User = require('../Models/User');
var Appointments = require('../Models/Appointments');

var names = ["aanvi ","Aadya ","Kiara      ","Diya  ","Pihu  ","Prisha  ","Ananya    ","Fatima ","Myra ","Sarah  ","Aarohi  ","Aaradhya ","Aarya  ","Sri ","Pari  ","Anvi ","Riya  ","Siya  ","Kavya  ","Ayesha ","Anika  ","Anaya      ","Advika    ","Aditi    ","Maryam      ","Riddhi ","Meera      ","Aanya    ","Ahana    ","Aayra      ","Sai    ","Maria      ","Samaira    ","Swara      ","Princess    ","Navya      ","Jia    ","Isha    ","Avani    ","Sophia ","Kyra    ","Shreya    ","Ira      ","Aadriti ","Amyra      ","Yazhini ","Vanya    ","Nisha ","Mishka ","Nitara"]


var obj ={


    insertRandom: async function(){
        try {
            
            let data = [];

            for (let i = 15; i < names.length ; i++) {
                
                data.push({
                        "city": names[(i%names.length)] + '  City',
                        "gender": "FEMALE",
                        "name": names[i],
                        "clinic":{
                            "clinicAddress": `${names[i]} address`,
                            "clinicName": `${names[i]} clinic`,
                            "clinicPinCode": "987655",
                        },
                        "number": `9876543${i}`,
                        "registeredOn": 1576846833000,
                        "role": "CLINIC",
                        "status": "REGISTERED",
                        "availability": [],
                        "documents": [],
                        "photos": []
                    
                });
                
            }


            var result = await User.create(data);

            console.log('res ',result);
            
        } catch (error) {
            console.log('err',error);
            
        }
    },

    insertAppointments: async function(){
        try {
            let today = new Date().getTime();

            let data = [];

            for (let i = 0; i < 30; i++) {
                data.push({
                    
                    "name": `Parth Patwa_${i}`,
                    "address": "uifhedf",
                    "number": "9930335323",
                    "status": "SCHEDULED",
                    "registeredOn": today,
                    "details":`details_${i}`,                   
                    "docId": "5de3e82f49c4da00172e8335",
                    "clinicId": "5de4afd8e7179a0d18dd50b1",
                    "doctor": "5de3e82f49c4da00172e8335",
                    "clinic": "5de4afd8e7179a0d18dd50b1",
                    
                });
                
            }


            var result = await Appointments.create(data);

            console.log('res ',result);
            
        } catch (error) {
            console.log('err',error);
            
        }
    },


    changes : async function(){
        try {
            
        var result = await   User.updateMany({gender:"FEMALE"},{gender:"Female"});

        console.log('res ',result);

        } catch (error) {
            console.log('err',error);
            
        }
    }

};


obj.changes();