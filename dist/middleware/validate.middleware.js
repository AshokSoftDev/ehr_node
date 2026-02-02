"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.validateQuery = validateQuery;
exports.validateBody = validateBody;
exports.validateParams = validateParams;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
function validate(schema) {
    return async (req, res, next) => {
        try {
            const validated = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Force reassign using Object.defineProperty
            if (validated.body !== undefined) {
                Object.defineProperty(req, 'body', {
                    value: validated.body,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            if (validated.query !== undefined) {
                Object.defineProperty(req, 'query', {
                    value: validated.query,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            if (validated.params !== undefined) {
                Object.defineProperty(req, 'params', {
                    value: validated.params,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessage = error.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join(', ');
                next(new errors_1.AppError(errorMessage, 400));
            }
            else {
                next(new errors_1.AppError('Validation failed', 400));
            }
        }
    };
}
function validateQuery(schema) {
    return async (req, res, next) => {
        try {
            const validatedQuery = await schema.parseAsync(req.query || {});
            Object.defineProperty(req, 'query', {
                value: validatedQuery,
                writable: true,
                enumerable: true,
                configurable: true
            });
            next();
        }
        catch (error) {
            handleValidationError(error, next);
        }
    };
}
function validateBody(schema) {
    return async (req, res, next) => {
        try {
            const validatedBody = await schema.parseAsync(req.body);
            Object.defineProperty(req, 'body', {
                value: validatedBody,
                writable: true,
                enumerable: true,
                configurable: true
            });
            next();
        }
        catch (error) {
            handleValidationError(error, next);
        }
    };
}
function validateParams(schema) {
    return async (req, res, next) => {
        try {
            const validatedParams = await schema.parseAsync(req.params);
            Object.defineProperty(req, 'params', {
                value: validatedParams,
                writable: true,
                enumerable: true,
                configurable: true
            });
            next();
        }
        catch (error) {
            handleValidationError(error, next);
        }
    };
}
function handleValidationError(error, next) {
    if (error instanceof zod_1.ZodError) {
        const errorMessage = error.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');
        next(new errors_1.AppError(errorMessage, 400));
    }
    else {
        next(new errors_1.AppError('Validation failed', 400));
    }
}
