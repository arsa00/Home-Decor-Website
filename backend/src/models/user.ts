import mongoose from "mongoose";


const schema = mongoose.Schema;

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
    },
    numOfOpenedPositions: {
        type: Number
    },
    numOfFilledPositions: {
        type: Number
    },
    imageType: {
        type: String
    },
    recoveryLink: {
        type: String
    },
    recoveryLinkTime: {
        type: Number
    }
});


const UserModel = mongoose.model("UserModel", User, 'user');
export { UserModel }