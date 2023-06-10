import mongoose from "mongoose";


const schema = mongoose.Schema;

let Client = new schema({

    username: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    phone: {
        type: String
    },
    mail: {
        type: String
    }
    

});

let Agency = new schema({

    username: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    idNumber: {
        type: String
    },
    phone: {
        type: String
    },
    mail: {
        type: String
    },
    description: {
        type: String
    }

});

let Admin = new schema({

    username: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    mail: {
        type: String
    }

});

let User = new schema({

    username: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    phone: {
        type: String
    },
    mail: {
        type: String
    },

    name: {
        type: String
    },
    address: {
        type: String
    },
    idNumber: {
        type: String
    },
    description: {
        type: String
    }

});

let UserModel = mongoose.model("UserModel", User, 'user');
let ClientModel = mongoose.model("ClientModel", Client, 'user');
let AgencyModel = mongoose.model("AgencyModel", Agency, 'user');
let AdminModel = mongoose.model("AdminModel", Admin, 'user');

export { UserModel, ClientModel, AgencyModel, AdminModel }