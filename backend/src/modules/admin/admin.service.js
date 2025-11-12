import User from '../../models/user.model.js';

export const adminService = {
    fetchAllUsers: async () => {
        // dont return admin user
        return await User.find();
    },

    // updateUser: 
};
