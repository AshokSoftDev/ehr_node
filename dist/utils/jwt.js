"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
exports.decodeJwt = decodeJwt;
exports.signRefreshToken = signRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function signJwt(payload, expiresIn = env_1.env.JWT_EXPIRES_IN) {
    const options = {
        expiresIn: expiresIn,
        issuer: 'your-app-name', // optional
        audience: 'your-app-audience', // optional
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, options);
}
function verifyJwt(token) {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
    }
    catch (error) {
        throw new Error(`Invalid token: ${error.message}`);
    }
}
// Optional: Add a decode function that doesn't verify (useful for debugging)
function decodeJwt(token) {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch {
        return null;
    }
}
// Optional: Add refresh token functionality
function signRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ sub: userId, type: 'refresh' }, env_1.env.JWT_SECRET, { expiresIn: '30d' } // Longer expiry for refresh tokens
    );
}
