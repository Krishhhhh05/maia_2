let helper={
    "getResV2": function (success=true, data, error = null, message = "") {
        let res = {success: 0, message: "", data: {}, error: {}};
        if (success) {
            res.success = 1;
        }
        if (data) {
            if (Array.isArray(data) && data.length === 0) {
                res.success = 0;
            }
            res.data = data
        }
        if (message) {
            res.message = message;
        }
        if (error) {
            res.message = error.message;
            res.error = error
        }
        return res
    },
    "getResV3": function ( data,success=true, error = null, message = "") {
        let res = {success: 0, message: "", data: {}, error: {}};
        if (success) {
            res.success = 1;
        }
        if (data) {
            if (Array.isArray(data) && data.length === 0) {
                res.success = 0;
            }
            res.data = data
        }
        if (message) {
            res.message = message;
        }
        if (error) {
            res.success=0;
            res.message = error.message;
            res.error = error
        }
        if(data == null){
            res.success=0;
            res.message="not found";
        }
        return res
    },

    "getLeads": function ( data,success=true, error = null, message = "") {
        let res = { data: {}};
        
        // if (success) {
        //     res.success = 1;
        // }
        if (data) {
            if (Array.isArray(data) && data.length === 0) {
                res.success = 0;
            }
            
            res.data = data
        }
        // if (message) {
        //     res.message = message;
        // }
        if (error) {
            res.success=0;
            res.message = error.message;
            res.error = error
        }
        if(data == null){
            res.success=0;
            res.message="not found";
        }
        return res.data
    },


}


module.exports=helper;
