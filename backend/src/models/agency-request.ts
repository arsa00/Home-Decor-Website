import mongoose from "mongoose";


const schema = mongoose.Schema;

let AgencyRequest = new schema({

    agencyId: {
        type: mongoose.Types.ObjectId
    },
    type: {
        type: Number
    },
    numOfPositions: {
        type: Number
    }
});


const AgencyRequestModel = mongoose.model("AgencyRequestModel", AgencyRequest, 'agency_request');
export { AgencyRequestModel }