export enum jobStatus {
    Pending = "pending",
    Cancelled = "cancelled",
    Hired = "hired",
    Retired = "retired",
    Fired = "fired" ,
    OnLeave = "onleave",
};

export enum connectionType {
    Friend = "friend",
    Acquaintance = "acquaintance",
    Coworker = "coworker",
    ExCoworker = "excoworker",
};

export enum connectionStatus {
    Pending = "pending",
    Cancelled = "cancelled",
    Declined = "declined",
    Accepted = "accepted",
};

export enum diplomaDegree {
    None = "none",
    Elementary = "elementary",
    HighSchool = "highschool",
    Bachelor = "bachelor",
    Master = "master",
    Doctorate = "doctorate"
};

export interface NamedMatchForUser {
    userURI : string;
    checkDegree? : boolean;
    jobType? : string;
    maxDistanceKm? : number;
    companyURI? : string;
};
