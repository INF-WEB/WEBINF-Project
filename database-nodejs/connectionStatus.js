export var connectionStatus;
(function (connectionStatus) {
    connectionStatus["Pending"] = "pending";
    connectionStatus["Cancelled"] = "cancelled";
    connectionStatus["Declined"] = "declined";
    connectionStatus["Accepted"] = "accepted";
})(connectionStatus || (connectionStatus = {}));
