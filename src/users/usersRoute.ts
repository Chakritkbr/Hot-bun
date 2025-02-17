import express, { Router } from 'express';
import * as usersControllers from './usersController';
import { AuthController } from '../auth/authController';
import {
  authenticateToken,
  authorizeRole,
  authorizeUser,
} from '../auth/authMiddleware';

const router: Router = express.Router();

router.post('/register', usersControllers.registerUser);
router.post('/login', usersControllers.loginUser);

router.put(
  '/user/:id',
  authenticateToken,
  authorizeUser,
  usersControllers.updateUser
);
router.delete(
  '/user/:id',
  authenticateToken,
  authorizeUser,
  usersControllers.deleteUser
);

router.post('/service/forgot-password', AuthController.forgotPassword);
router.post('/service/verify-otp', AuthController.verifyOTP);
router.post('/service/resetpassword', AuthController.resetPassword);

export default router;
