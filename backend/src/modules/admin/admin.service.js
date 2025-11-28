import User from '../../models/user.model.js';

export const adminService = {
    getAllUsers: async () => {
        // dont return admin user
        const users = await User.find({ role: { $ne: 'admin' } });
        return users.map((user) => user.toJSON());
    },

    getUserById: async (id) => {
        const user = await User.findOne({
            _id: id,
            role: { $ne: ['admin', 'chairman', 'decision committe'] },
        });

        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }

        return user.toJSON(); 
    },

     deleteUserById: async (id) => {
        const user = await User.findOne({
            _id: id,
            role: { $ne: 'admin' },
        });

        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }

        await user.deleteOne();

        return {message: "User Deletion Successfull"}; 
    },
    // updateUser:
};
