import { Constants } from '../../config/constants.js';
import { CompalainValidator } from '../../utils/validators/complainValidator.js';
import { Complain } from '../../models/complain.model.js';
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
