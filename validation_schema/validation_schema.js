const registration_schema = {
    "email_address" : {
        notEmpty : true,
        isEmail : {
            errorMessage : "Invalid email"
        }
    },
    "username" : {
        notEmpty: true,
        isLength : {
            options : [ {min:12} ],
            errorMessage : "Must be at least 12 characters"
        },
        matches: {
            options : [ "^[a-z 0-9,.'-]+$", "i" ],
            errorMessage  : "The username can only contain letters and the characters (,.'-)"
        }
    },
    "gender" : {
        notEmpty: true,
        isLength : {
            options : [ {min:4, max:6 } ],
            errorMessage : "Must be at least 4 characters and maxinum 6 characters"
        },
        matches: {
            options : [ "^[a-z ,.'-]+$", "i" ],
            errorMessage  : "The first name can only contain letters and the characters (,.'-)"
        }
    },
    "password" : {
        notEmpty: true,
        isLength : {
            options : [ {min:10} ],
            errorMessage : "Must be at least 10 characters"
        }
    }
}



module.exports = {
    registration_schema
}