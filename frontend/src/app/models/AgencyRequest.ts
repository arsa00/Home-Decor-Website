enum RequestType {
    NEW_OPEN_POSITIONS
}

class AgencyRequest {
    _id?: string;
    agencyId: string;
    type: RequestType;
    numOfPositions: number;  // for new open positions request
}

export { AgencyRequest, RequestType };