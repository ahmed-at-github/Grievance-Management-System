import User from '../../models/user.model.js';
import { sendMail } from '../../utils/email.js';
import { generatePass } from '../../utils/generate-password.js';
import { comparePassword, hashPassword } from '../../utils/bcrypt.js';
import jwt from 'jsonwebtoken';

export const authService = {
    fetchUsers: async () => {
        return await User.find().sort({ createdAt: -1 });
    },

    fetchUserById: async (id) => {
        return await User.findById(id);
    },

    createUser: async (body) => {
        const duplicate = await User.findOne({
            email: body.email,
        });
        if (duplicate) {
            const err = new Error('User alreday exist');
            err.statusCode = 409;
            throw err;
        }

        const customPassword = generatePass();
        sendMail(body.email, customPassword);
        const hashPass = await hashPassword(customPassword);
        body.password = hashPass;

        const user = await User.create(body);

        return user.toJSON();
    },

    loginUser: async (body) => {
        const foundUser = await User.findOne({ email: body.email });

        if (!foundUser) {
            const err = new Error('user not found');
            err.statusCode = 404;
            throw err;
        }

        const match = await comparePassword(body.password, foundUser.password);
        if (!match) {
            const err = new Error('password wrong');
            err.statusCode = 401;
            throw err;
        }

        //make custom func
        const accessToken = jwt.sign(
            { id: foundUser._id, role: foundUser.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' },
        );

        const refreshToken = jwt.sign(
            { id: foundUser._id, role: foundUser.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' },
        );

        return { accessToken, refreshToken };
    },

    generateToken: (body) => {
        console.log(body);

        //make custom func
        const accessToken = jwt.sign(
            { id: body.id, role: body.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' },
        );

        const refreshToken = jwt.sign(
            { id: body.id, role: body.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' },
        );

        return { accessToken, refreshToken };
    },

    // deleteUser: async (id) => {
    //     return await User.findByIdAndDelete(id);
    // },
};
