import { Router } from "express";
import * as adminController from "./admin.controller.js"

const router = Router();


router.get('/users', adminController.getAllUsers); 
router.patch("/user/:userId", adminController.editUser)
// fetch(`localhost:8000/users`)

// router.get('/user/{id}', authController.getUser); 

// router.patch('/user/{id}', verifyJwtToken, verify-Adminrole-middleware, authController.register); 

// router.delete('/user/{id}', verifyJwtToken, verify-Adminrole-middleware, authController.register); 

export default router; 
 
