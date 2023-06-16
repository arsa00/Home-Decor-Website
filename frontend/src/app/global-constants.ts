export class GlobalConstants {
    static readonly URI: string = "http://localhost:4000";

    static readonly LOCAL_STORAGE_LOGGED_USER = "loggedUser";
    static readonly SESSION_STORAGE_REGISTRATION = "registrationSuccessful";
    static readonly SESSION_STORAGE_PASS_RESET = "passResetSuccessful";
    static readonly SESSION_STORAGE_PASS_RESET_REQ = "passResetRequestSuccessful";

    static readonly ADMIN_TYPE: string = "admin";
    static readonly AGENCY_TYPE: string = "agency";
    static readonly CLIENT_TYPE: string = "client";

    static readonly STATUS_PENDING: string = "PENDING";
    static readonly STATUS_ACCEPTED: string = "ACCEPTED";
    static readonly STATUS_REJECTED: string = "REJECTED";
}