import Joi from 'joi';

export const UserValidator = Joi.object({
    name: Joi.string().trim().min(2).max(50),
    email: Joi.string().email(),
    role: Joi.string().valid('student', 'chairman', 'dean', 'admin'),
    studId: Joi.string().trim(),
    session: Joi.string().trim(),
    dept: Joi.string().trim(),
    section: Joi.string().trim(),
}).min(1); // at least one field must be provided
