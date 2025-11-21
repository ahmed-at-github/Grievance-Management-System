import { Router } from 'express';
import * as complainController from "./complain.controller.js"

const router = Router();

router.post('/create', complainController.createComplain); //studnet middleware, complain text, title  cannt be same , within same studnetId

router.get('/', complainController.getAllComplains); //admin, studnet middleware 

export default router;
