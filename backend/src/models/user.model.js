import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
        },

        role: {
            type: String,
            enum: ['student', 'chairman', 'dean', 'admin'],
            required: [true, 'Role is required'],
        },

        // Student-specific fields
        studId: {
            type: String,
            required: function () {
                return this.role === 'student';
            },
            unique: function () {
                return this.role === 'student';
            },
            sparse: true,
        },

        session: {
            type: String,
            required: function () {
                return this.role === 'student';
            },
        },

        dept: {
            type: String,
            required: function () {
                return this.role === 'student';
            },
        },

        section: {
            type: String,
            required: function () {
                return this.role === 'student';
            },
        },
    },
    { timestamps: true },
);

// Ensure only one chairman and one dean
userSchema.pre('save', async function (next) {
    if (this.isNew && (this.role === 'chairman' || this.role === 'dean')) {
        const existing = await mongoose.models.User.findOne({
            role: this.role,
        });
        if (existing) {
            const err = new Error(`Only one ${this.role} is allowed.`);
            err.name = 'ValidationError';
            return next(err);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
