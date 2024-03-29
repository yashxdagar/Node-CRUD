"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = __importDefault(require("../../loaders/logger"));
const controller_1 = require("./controller");
const validator_1 = require("./validator");
const authRouter = (0, express_1.Router)();
async function handleLogin(req, res) {
    var _a;
    try {
        const result = await (0, controller_1.loginUser)(req.body.email, req.body.password);
        res.status(result.status).json({
            message: result.message,
            token: (_a = result.token) !== null && _a !== void 0 ? _a : '',
        });
    }
    catch (e) {
        logger_1.default.error(e);
        res.status(e.status || 500).json({
            message: e.message || 'Request Failed',
        });
    }
}
async function handleSignUp(req, res) {
    try {
        const result = await (0, controller_1.createUser)(req.body);
        if (result.bool) {
            res.status(201).json({
                message: "Success",
            });
        }
        else {
            throw {
                status: 400,
                message: result.message,
            };
        }
    }
    catch (e) {
        logger_1.default.error(e);
        res.status(e.status || 500).json({
            message: e.message || 'Request Failed',
        });
    }
}
async function handleGetProfile(req, res) {
    try {
        const token = req.headers.authorization;
        logger_1.default.info(token);
        const user = await (0, controller_1.getProfile)(token.substring(7, token.length));
        res.status(200).json({
            message: 'Success',
            data: user
        });
    }
    catch (e) {
        logger_1.default.error(e);
        res.status(e.status || 500).json({
            message: e.message || 'Request Failed',
        });
    }
}
authRouter.post('/login', validator_1.loginValidator, handleLogin);
authRouter.post('/signUp', validator_1.signUpValidator, handleSignUp);
authRouter.get('/', validator_1.getProfileValidator, handleGetProfile);
exports.default = authRouter;
//# sourceMappingURL=router.js.map