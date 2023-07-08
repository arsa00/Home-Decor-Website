import mongoose from "mongoose";

enum JobState {
    PENDING,
    REJECTED,
    ACCEPTED,
    ACTIVE,
    CANCELED,
    FINISHED
}

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
    agencyName: {
        type: String
    },
    objectID: {
        type: ObjectId
    },
    objectType: {
        type: String
    },
    objectAddress: {
        type: String
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
    },
    cancelReqMsg: {
        type: String
    },
    clientFirstname: {
        type: String
    },
    clientLastname: {
        type: String
    },
    clientPhone: {
        type: String
    },
    clientMail: {
        type: String
    },
    assignedEmployees: {
        type: Array
    }
});

const JobModel = mongoose.model("JobModel", Job, "job");

export { JobModel, JobState }