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
            enum: ['pending', 'in-review', 'resolved', 'rejected'],
            default: 'pending',
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
