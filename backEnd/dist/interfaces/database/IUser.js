"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.RequestStatus = void 0;
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["Pending"] = "pending";
    RequestStatus["Approved"] = "approved";
    RequestStatus["Rejected"] = "rejected";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var Profession;
(function (Profession) {
    Profession["Student"] = "student";
    Profession["Working"] = "working";
})(Profession || (Profession = {}));
var Role;
(function (Role) {
    Role["Student"] = "student";
    Role["Instructor"] = "instructor";
    Role["Admin"] = "admin";
    Role["Pending"] = "pending";
})(Role || (exports.Role = Role = {}));
