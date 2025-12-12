import mongoose from 'mongoose';

const complainSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        complain: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['academic', 'administrative', 'infrastructure', 'other'],
            default: 'other',
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'resolved', 'rejected'],
            default: 'pending',
            required: true,
        },
        view: {
            type: String,
            enum: ['public', 'private'],
            default: 'private',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // chairman or committe
        },
        response: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 500,
        },
    },
    { timestamps: true },
);

export const Complain = mongoose.model('Complain', complainSchema);
