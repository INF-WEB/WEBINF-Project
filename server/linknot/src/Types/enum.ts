import { StringLiteral } from "typescript";

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

export interface MatchForUser {
    userURI : string;
    checkDegree? : boolean;
    jobType? : string;
    maxDistanceKm? : number;
    companyURI? : string;
};

export interface MatchForJob {
    jobURI : string;
    checkDegree? : boolean;
    maxDistanceKm? : number;
};

export interface UpdateUser {
    firstname?: string;
    lastname?: string;
    webpage?: string;
    lookingForJob?: boolean;
}

export interface UpdateCompany {
    name?: string;
    webpage?: string;
    headquaters?: string;
}

export interface UpdateJob {
    jobName?: string, 
    area?: string;
    workexperience?: string;
    diploma?: diplomaDegree;
    jobdescription?: string;
    status?: jobStatus;
    type?: string;
}

export interface UpdateDiploma {
    graduation?: Date;
    field?: string;
    degree?: diplomaDegree;
    educationalInstitute?: string;
}

export interface UpdateProfessionalExperience {
    startDate?: Date;
    endDate?: Date;
    description?: string;
}

export interface UpdateConnection {
    status?: connectionStatus;
    type?: connectionType;
}