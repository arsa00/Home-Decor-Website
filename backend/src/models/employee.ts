import mongoose from "mongoose";


const schema = mongoose.Schema;

let Employee = new schema({

    agencyId: {
        type: mongoose.Types.ObjectId
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
    specialization: {
        type: String
    }
});


const EmployeeModel = mongoose.model("EmployeeModel", Employee, 'employees');
export { EmployeeModel }