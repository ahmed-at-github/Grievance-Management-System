import { Constants } from '../../config/constants.js';
import { UserValidator } from '../../utils/validators/userValidator.js';
import { adminService } from './admin.service.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await adminService.fetchAllUsers();
        console.log(users);

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

export const editUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        console.log(userId);
        // mongodb te id ta search krbi je ey id ta ase nki tkhle ok na tkhl error user not found

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
