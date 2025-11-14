import {
    loginValidator,
    UserValidator,
} from '../../utils/validators/userValidator.js';
import { authService } from './auth.service.js';
import { Constants } from '../../config/constants.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/user.model.js';

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
        
        res.status(Constants.HTTP_STATUS.OK).json({
            success: true,
            data: newUser,
        });
    } catch (err) {
        next(err);
    }
};

// check email or studid and password, use bcrypt and jwt to send acces and refresh token in cookie
//  also use validators, send errors

export const handleLogin = async (req, res, next) => {
    try {
        const { error, value } = loginValidator.validate(req.body, {
            abortEarly: false, // return all validation errors
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.details.map((d) => d.message),
            });
        }

        const { accessToken, refreshToken } =
            await authService.loginUser(value);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        }).json({ accessToken: accessToken });
    } catch (err) {
        next(err);
    }
};

//  check refrsh token from cookie then generate new accesstoken and send it to json
//  geerate new refrsh token and send in cookie
export const getRefreshToken = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const data = { id, role };

        const { accessToken, refreshToken } = authService.generateToken(data);

        console.log(accessToken, refreshToken);
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        }).json({ accessToken: accessToken });
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
