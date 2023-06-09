export class GlobalConstants {
    static readonly URI: string = "http://localhost:4000";

    static readonly LOCAL_STORAGE_LOGGED_USER = "loggedUser";
    static readonly LOCAL_STORAGE_LOGGED_ADMIN = "loggedAdmin";
    static readonly SESSION_STORAGE_REGISTRATION = "registrationSuccessful";
    static readonly SESSION_STORAGE_PASS_RESET = "passResetSuccessful";
    static readonly SESSION_STORAGE_PASS_RESET_REQ = "passResetRequestSuccessful";
    static readonly SESSION_STORAGE_JOB_ADDED = "jobAddedSuccessfully";

    static readonly ADMIN_TYPE: string = "admin";
    static readonly AGENCY_TYPE: string = "agency";
    static readonly CLIENT_TYPE: string = "client";
    static readonly NONE_TYPE: string = "guest";

    static readonly STATUS_PENDING: string = "PENDING";
    static readonly STATUS_ACCEPTED: string = "ACCEPTED";
    static readonly STATUS_REJECTED: string = "REJECTED";

    static readonly REGEX_MAIL: string = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
    static readonly REGEX_PHONE: string = "^[0-9/\\-+ ]{5,25}$";

    private static readonly lChar = "[a-z]";  // lowercase char
    private static readonly uChar = "[A-Z]";  // uppercase char
    private static readonly num = "[0-9]";
    private static readonly spec = "[\\\\\\-*+.,&^%$#@!?~`/()_=[\\]{};:'\"><|]";
    static readonly REGEX_PASSWORD: string = `^(${GlobalConstants.lChar}.*(${GlobalConstants.uChar}.*${GlobalConstants.num}.*${GlobalConstants.spec}|${GlobalConstants.uChar}.*${GlobalConstants.spec}.*${GlobalConstants.num}|${GlobalConstants.spec}.*${GlobalConstants.uChar}.*${GlobalConstants.num}|${GlobalConstants.spec}.*${GlobalConstants.num}.*${GlobalConstants.uChar}|${GlobalConstants.num}.*${GlobalConstants.spec}.*${GlobalConstants.uChar}|${GlobalConstants.num}.*${GlobalConstants.uChar}.*${GlobalConstants.spec})|${GlobalConstants.uChar}.*(${GlobalConstants.num}.*${GlobalConstants.spec}|${GlobalConstants.spec}.*${GlobalConstants.num})).*$`;

    // common routes
    static readonly ROUTE_LOGIN = "";
    static readonly ROUTE_REGISTER = "register";
    static readonly ROUTE_REQ_PASS_RESET = "requestPasswordReset";
    static readonly ROUTE_PASS_RESET = "resetPassword";

    // guest routes
    static readonly ROUTE_GUEST_PAGE = "guestPage";
    static readonly ROUTE_GUEST_AGENCY_DETAILS = "agencyDetails";

    // client routes
    static readonly ROUTE_CLIENT_PROFILE = "clientProfile";
    static readonly ROUTE_CLIENT_OBJECTS = "clientObjects";
    static readonly ROUTE_CLIENT_AGENCIES_SEARCH = "agenciesSearch";
    static readonly ROUTE_CLIENT_HIRE_AGENCY_REQ = "hireAgency";
    static readonly ROUTE_CLIENT_JOBS_LIST = "clientJobsList";
    static readonly ROUTE_CLIENT_JOB_DETAILS = "clientJobDetails";

    // agency routes
    static readonly ROUTE_AGENCY_PROFILE = "agencyProfile";
    static readonly ROUTE_AGENCY_EMPLOYEES = "agencyEmployees";
    static readonly ROUTE_AGENCY_JOB_LIST = "agencyJobList";

    // admin routes
    static readonly ROUTE_ADMIN_LOGIN = "adminLogin";
    static readonly ROUTE_ADMIN_DASHBOARD = "adminDashboard";
    static readonly ROUTE_ADMIN_USER_LIST = "adminUserList";
    static readonly ROUTE_ADMIN_ADD_USER = "adminAddUser";
    static readonly ROUTE_ADMIN_AGENCY_EMPLOYEES = "adminAgencyEmployees";
    static readonly ROUTE_ADMIN_JOB_LIST = "adminJobList";
    static readonly ROUTE_ADMIN_JOB_DETAILS = "adminJobDetails";

}