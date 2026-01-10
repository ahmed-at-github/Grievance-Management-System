import Joi from 'joi';

export const UserValidator = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().allow('').required(),
    role: Joi.string().valid('student', 'chairman', 'dean', 'admin').required(),
    studId: Joi.string().trim(),
    session: Joi.string().trim(),
    dept: Joi.string().trim(),
    section: Joi.string().trim(),
}).min(1); // at least one field must be provided

export const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
}).min(2); // at least 2 field must be provided