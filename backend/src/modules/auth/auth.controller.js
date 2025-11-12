// import { userService } from '../services/user.service.js';
// import { Constants } from '../config/constants.js';

import { UserValidator } from '../../utils/validators/userValidator.js';
import { authService } from './auth.service.js';

// create accnt for vc, dean, student
// handle password and auto send email password using nodemailer
export const register = async (req, res, next) => {
    try {
        const { error, value } = UserValidator.validate(req.body, {
            abortEarly: false, // return all validation errors
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.details.map((d) => d.message),
            });
        }

        const newUser = await authService.createUser(value);

        res.json(newUser);
    } catch (err) {
        next(err);
    }
};

// check email or studid and password, use bcrypt and jwt to send acces and refresh token in cookie
//  also use validators, send errors

export const handleLogin = async (req, res, next) => {
    try {
        res.json({ message: 'loggin in!' });
    } catch (err) {
        next(err);
    }
};

//  check refrsh token from cookie then generate new accesstoken and send it to json
//  new refrsh token in cookie
export const refreshToken = async (req, res, next) => {
    try {
        res.json({ message: 'refres token!' });
    } catch (error) {
        next(error);
    }
};

// check accesstoken to get userId and send user-general info not sensitive info
export const getUserInfo = async (req, res, next) => {
    try {
        res.json({ message: 'user info by user!' });
    } catch (error) {
        next(error);
    }
};

// clearcookie refreshtoken
export const handleLogout = async (req, res, next) => {
    try {
        res.json({ message: 'logout!' });
    } catch (error) {
        next(error);
    }
};
