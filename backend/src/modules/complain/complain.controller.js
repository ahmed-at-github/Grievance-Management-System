import { Constants } from '../../config/constants.js';
import { CompalainValidator } from '../../utils/validators/complainValidator.js';
import {Complain} from "../../models/complain.model.js"

export async function createComplain(req, res, next) {
    try {
        const body = { ...req.body };

        const { error, value } = CompalainValidator.validate(body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
                message: 'Valiation Failed',
                errors: error.details.map((d) => d.message),
            });
        }

        const doc = await Complain.create(value);   
        const complain = await Complain.findById(doc._id).select("-assignedTo");

        return res.status(Constants.HTTP_STATUS.OK).json(complain)
    } catch (error) {
        next(error)
    }
}

export async function getAllComplains(req, res, next) {

    try {
        const complain = await Complain.find(); // send diff response dependeing on role  

        return res.status(Constants.HTTP_STATUS.OK).json(complain)
        
    } catch (error) {
        next(error)
    }
}
