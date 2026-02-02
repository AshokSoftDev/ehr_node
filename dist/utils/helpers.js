"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationMeta = getPaginationMeta;
exports.sanitizeUser = sanitizeUser;
exports.generateOTP = generateOTP;
exports.getOTPExpiry = getOTPExpiry;
function getPaginationMeta(page, limit, total) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
    };
}
function sanitizeUser(user) {
    const { password, otp, otpExpiry, ...sanitized } = user;
    return sanitized;
}
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function getOTPExpiry(minutes = 10) {
    return new Date(Date.now() + minutes * 60 * 1000);
}
