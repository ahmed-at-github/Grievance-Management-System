import { Complain } from '../../models/complain.model.js';
import User from '../../models/user.model.js';
import { deleteComplain, editComplain } from './complain.controller.js';

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
                {view: "public"},
                { assignedTo: 0, studentId: 0 },
            );

            return {
                message: 'All Complain Successfully sent',
                complain: allComplain,
            };
        }

        if (
            role === 'admin' ||
            role === 'chairman' ||
            role === 'decision committee'
        ) {
            const allComplain = await Complain.find({
                view: "public"
            }).populate('studentId');

            return {
                message: 'All Complain Successfully sent',
                complain: allComplain,
            };
        }

        const err = new Error('Error sending Complain. Role undefined!');
        err.statusCode = 400;
        throw err;
    },

    getAllPvtComplains: async (role, userId) => {
        const user = User.findById(userId);

        if (!user || user.role === role) {
            const err = new Error('Error User not found');
            err.statusCode = 404;
            throw err;
        }

        if (role === 'student') {
            // Only fetches private complaints for this specific user
            const pvtComplains = await Complain.find(
                {
                    studentId: userId,
                    view: 'private',
                },
                { studentId: 0},
            ).populate({path: "assignedTo", select: "-email, -name"});

            return {
                message: 'All Complain Successfully sent',
                complain: pvtComplains,
            };
        }

        if (
            role === 'chairman' ||
            role === 'decision committee'
        ) {
            // Only fetches private complaints for this specific user
            const pvtComplains = await Complain.find({
                assignedTo: userId,
                view: 'private',
            }).populate('studentId');

            return {
                message: 'All Complain Successfully sent',
                complain: pvtComplains,
            };
        }

        const err = new Error('Error sending Complain. Role undefined!');
        err.statusCode = 400;
        throw err;
    },

    editComplain: async (body, id) => {
        const complaint = await Complain.findById(id);

        if (
            complaint.status === 'resolved' ||
            complaint.status === 'rejected'
        ) {
            const err = new Error(
                'Resolved or Rejected complaints cannot be edited.',
            );
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

    deleteComplain: async (id) => {
    // findByIdAndDelete returns the document that was deleted
    const deletedComplain = await Complain.findByIdAndDelete(id);

    if (!deletedComplain) {
        const error = new Error('Complain not found');
        error.status = 404; // Or Constants.HTTP_STATUS.NOT_FOUND
        throw error;
    }

    return { message: 'Complain deleted successfully' };
}
};
