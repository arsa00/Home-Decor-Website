import mongoose from "mongoose";

const schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

let Job = new schema({
    state: {
        type: Number
    },
    clientID: {
        type: ObjectId
    },
    agencyID: {
        type: ObjectId
    },
    objectID: {
        type: ObjectId
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    agencyOffer: {
        type: Number
    },
    cancelRequested: {
        type: Boolean
    }
});

const JobModel = mongoose.model("JobModel", Job, "job");

export { JobModel }