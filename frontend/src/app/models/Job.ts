enum JobState {
    PENDING,
    REJECTED,
    ACCEPTED,
    ACTIVE,
    CANCELED,
    FINISHED
}

class Job {
    _id?: string;
    state: JobState;
    clientID: string;
    agencyID: string;
    agencyName: string
    objectID: string;
    objectType: string;
    objectAddress: string;
    startDate: Date;
    endDate: Date;
    agencyOffer: number;
    cancelRequested: boolean;
    cancelReqMsg?: string;

    constructor(clientID: string, agencyID: string, agencyName: string, objectID: string, objectType: string, objectAddress: string, startDate: Date, endDate: Date) {
        this.agencyID = agencyID;
        this.agencyName = agencyName;
        this.agencyOffer = 0;
        this.cancelRequested = false;
        this.clientID = clientID;
        this.endDate = endDate;
        this.objectID = objectID;
        this.objectType = objectType;
        this.objectAddress = objectAddress;
        this.startDate = startDate;
        this.state = JobState.PENDING;
    }
}

export { Job, JobState }