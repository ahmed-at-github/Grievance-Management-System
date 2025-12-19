import { response } from 'express';
import Joi from 'joi';

export const CompalainValidator = Joi.object({
    studentId: Joi.string().trim().min(2).required(),
    title: Joi.string().trim().min(2).max(50).required(),
    complain: Joi.string().trim().min(2).max(200).required(),
    category: Joi.string().valid(
        'academic',
        'administrative',
        'dean',
        'infrastructure',
        'other',
    ),
    status: Joi.string()
        .trim()
        .valid('pending', 'approved', 'resolved', 'rejected'),
    view: Joi.string().trim().valid('public', 'private'),
    assignedTo: Joi.string().trim(),
}).min(3); // at least one field must be provided

export const CompalainEditValidator = Joi.object({
    title: Joi.string().trim().min(2).max(50),
    complain: Joi.string().trim().min(2).max(200),
    category: Joi.string().valid(
        'academic',
        'administrative',
        'dean',
        'infrastructure',
        'other',
    ),
    status: Joi.string()
        .trim()
        .valid('pending', 'in-review', 'resolved', 'rejected').optional(),
    assignedTo: Joi.string().trim(),
    response: Joi.string().trim().min(2).max(500).optional(),
}).min(1); // at least one field must be provided
