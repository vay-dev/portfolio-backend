"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.created = created;
exports.fail = fail;
function ok(res, data, message = "Success") {
    res.json({ success: true, message, data });
}
function created(res, data, message = "Created") {
    res.status(201).json({ success: true, message, data });
}
function fail(res, message, status = 400) {
    res.status(status).json({ success: false, message, data: null });
}
