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
            const allComplain = await Complain.find({
                view: 'public',
            }).populate({ path: 'studentId', select: '_id' });

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
                view: 'public',
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
        const user = await User.findById(userId);

        if (!user || user.role !== role) {
            const err = new Error('Error User not found');
            err.statusCode = 404;
            throw err;
        }

        if (role === 'student') {
            // Only fetches private complaints for this specific user
            const pvtComplains = await Complain.find(
                {
                    studentId: userId,
                },
                { studentId: 0 },
            ).populate({ path: 'assignedTo', select: '-email, -name' });

            return {
                message: 'All Complain Successfully sent',
                complain: pvtComplains,
            };
        }

        if (role === 'chairman' || role === 'decision committee') {
            // Only fetches private complaints for this specific user
            const pvtComplains = await Complain.find({
                assignedTo: user.role,
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

    editComplain: async (body, id, user) => {
        const complaint = await Complain.findById(id);

        // 1. Global Check: Cannot edit if resolved/rejected (applies to everyone)
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

        // 2. Logic: Student Role + Pending State + specific fields
        const updateData = { ...body }; // Create a copy of the body

       
            // A. Check Status
            if (complaint.status !== 'pending' && user.role === 'student') {
                const err = new Error(
                    'Students can only edit complaints while they are pending.',
                );
                err.statusCode = 400; // or 403 Forbidden
                throw err;
            }

            // 3. Perform Update
            const updateComplain = await Complain.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true },
            );

            if (!updateComplain) {
                const err = new Error('Error updating Complain.');
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
    },
};
