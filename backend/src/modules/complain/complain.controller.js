import { Constants } from '../../config/constants.js';
import {
    CompalainEditValidator,
    CompalainValidator,
} from '../../utils/validators/complainValidator.js';
import { complainService } from './complain.service.js';

export async function createComplain(req, res, next) {
    try {
        const body = { ...req.body };
        const studId = req.user.id;

        body.studentId = studId;

        const { error, value } = CompalainValidator.validate(body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
                message: 'Valiation Failed',
                errors: error.details.map((d) => d.message),
            });
        }

        const { message, complain } =
            await complainService.createComplain(value);

        return res
            .status(Constants.HTTP_STATUS.OK)
            .json({ success: true, message, data: complain });
    } catch (error) {
        next(error);
    }
}

export async function getAllComplains(req, res, next) {
    try {
        const role = req.user.role;

        const { message, complain } =
            await complainService.getAllComplains(role);

        return res.status(Constants.HTTP_STATUS.OK).json({
            success: true,
            message,
            count: complain.length,
            data: complain,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllPvtComplains(req, res, next) {
    try {
        const role = req.user.role;
        const userId = req.params.id;

        const { message, complain } = await complainService.getAllPvtComplains(
            role,
            userId,
        );

        return res.status(Constants.HTTP_STATUS.OK).json({
            success: true,
            message,
            count: complain.length,
            data: complain,
        });
    } catch (error) {
        next(error);
    }
}

export async function editComplain(req, res, next) {
    try {
        const id = req.params.id;
        const body = req.body;
        const user = req.user;

        const { error, value } = CompalainEditValidator.validate(body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
                message: 'Valiation Failed',
                errors: error.details.map((d) => d.message),
            });
        }

        const { message, updateComplain } = await complainService.editComplain(
            value,
            id,
            user,
        );

        return res
            .status(Constants.HTTP_STATUS.OK)
            .json({ success: true, message, data: updateComplain });
    } catch (err) {
        next(err);
    }
}

export async function deleteComplain(req, res, next) {
    try {
        const id = req.params.id;

        // You might want to pass req.user here later to verify ownership
        const { message } = await complainService.deleteComplain(id);

        return res
            .status(Constants.HTTP_STATUS.OK)
            .json({ success: true, message });
    } catch (err) {
        next(err);
    }
}
