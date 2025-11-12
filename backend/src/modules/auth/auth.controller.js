// import { userService } from '../services/user.service.js';
// import { Constants } from '../config/constants.js';

import { UserValidator } from '../../utils/validators/userValidator.js';
import { authService } from './auth.service.js';

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
        
     
        
        
        const newUser = await authService.createUser(value)

        res.json(newUser)

    
    } catch (err) {
        next(err);
    }
};

export const handleLogin = async (req, res, next) => {
    try {
        res.json({ message: 'loggin in!' });
    } catch (err) {
        next(err);
    }
};
