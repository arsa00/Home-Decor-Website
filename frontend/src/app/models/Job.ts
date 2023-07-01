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
    objectID: string;
    startDate: Date;
    endDate: Date;
    agencyOffer: number;
    cancelRequested: boolean;

    constructor(clientID: string, agencyID: string, objectID: string, startDate: Date, endDate: Date) {
        this.agencyID = agencyID;
        this.agencyOffer = 0;
        this.cancelRequested = false;
        this.clientID = clientID;
        this.endDate = endDate;
        this.objectID = objectID;
        this.startDate = startDate;
        this.state = JobState.PENDING;
    }
}