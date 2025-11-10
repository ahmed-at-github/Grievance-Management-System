// import { userService } from '../services/user.service.js';
// import { Constants } from '../config/constants.js';

export const register = async (req, res, next) => {
    try {
       res.json({message: "hi!"})
    } catch (err) {
        next(err);
    }
};

export const handleLogin = async (req, res, next) => {
    try {
       res.json({message: "loggin in!"})
    } catch (err) {
        next(err);
    }
};
