export var jobStatus;
(function (jobStatus) {
    jobStatus["Pending"] = "pending";
    jobStatus["Cancelled"] = "cancelled";
    jobStatus["Hired"] = "hired";
    jobStatus["Retired"] = "retired";
    jobStatus["Fired"] = "fired";
    jobStatus["OnLeave"] = "onleave";
})(jobStatus || (jobStatus = {}));
