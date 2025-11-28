import { Complain } from '../../models/complain.model.js';
import { editComplain } from './complain.controller.js';

export const complainService = {
    createComplain: async (body) => {
        // Check if title or complain already exists for this student
        const existing = await Complain.findOne({
            student: body.studId,
            $or: [{ title: body.title }, { complain: body.complain }],
        });

        if (existing) {
            const err = new Error(
                'You have already submitted a complaint with this title or text.',
            );
            err.statusCode = 400;
            throw err;
        }

        // If not exists, create complaint
        const doc = await Complain.create(body);
        const newComplain = await Complain.findById(doc._id).select(
            '-assignedTo',
        );

        return {
            message: 'Complain created Successfull',
            complain: newComplain,
        };
    },
    getAllComplains: async (role) => {
        if (role == 'student') {
            const allComplain = await Complain.find(
                {},
                { assignedTo: 0, studentId: 0 },
            );

            return {
                message: 'All Complain Successfully sent',
                complain: allComplain,
            };
        }

        if (role == 'admin') {
            const allComplain = await Complain.find();

            return {
                message: 'All Complain Successfully sent',
                complain: allComplain,
            };
        }

        const err = new Error('Error sending Complain. Role undefined!');
        err.statusCode = 400;
        throw err;
    },
    editComplain: async (body, id) => {
        const complaint = await Complain.findById(id);

        if (complaint.status === 'resolved') {
            const err = new Error('Resolved complaints cannot be edited.');
            err.statusCode = 400;
            throw err;
        }

        const updateComplain = await Complain.findByIdAndUpdate(
            id,
            { $set: body }, // <-- Uses frontend body
            { new: true, runValidators: true }, // Apply validations!
        );
        //assigned to is ref to user

        if (!updateComplain) {
            const err = new Error(
                'Error updating Complain. Complain maybe not found',
            );
            err.statusCode = 400;
            throw err;
        }

        return {
            message: 'Complain updated Successfully',
            updateComplain,
        };
    },
};
