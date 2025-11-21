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
        .valid('pending', 'in-review', 'resolved', 'rejected'),
    assignedTo: Joi.string().trim(),
}).min(3); // at least one field must be provided
