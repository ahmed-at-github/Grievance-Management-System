import { Constants } from '../../config/constants.js';
import { UserValidator } from '../../utils/validators/userValidator.js';
import { adminService } from './admin.service.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await adminService.getAllUsers();

        // mongodb theke all users ene, admin user send krbina
        res.status(Constants.HTTP_STATUS.OK).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getUserbyId = async (req, res, next) => {
    try {
        const Id = req.params.userId;

        const user = await adminService.getUserById(Id);

        // mongodb theke all users ene, admin user send krbina
        res.status(Constants.HTTP_STATUS.OK).json({
            success: true,
            count: user.length,
            data: user,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const editUser = async (req, res, next) => { //work to be done
    try {
        const { userId } = req.params;

        const { error, value } = UserValidator.validate(req.body, {
            abortEarly: false, // return all validation errors
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.details.map((d) => d.message),
            });
        }

        console.log(value);
        res.status(200).json(value);
    } catch (error) {
        next(error);
    }
};

export const deleteUserbyId = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const { message } = await adminService.deleteUserById(userId);

        res.status(Constants.HTTP_STATUS.OK).json({
            success: true,
            message,
        });
    } catch (error) {
        next(error);
    }
};
