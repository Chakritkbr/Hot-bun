import express, { Router } from 'express';
import * as authControllers from '../auth/authController';
import * as usersControllers from './usersController';
import {
  authenticateToken,
  authorizeRole,
  authorizeUser,
} from '../auth/authMiddleware';

const router: Router = express.Router();

router.post('/register', usersControllers.registerUser);
router.post('/login', usersControllers.loginUser);
router.get(
  '/protected',
  authenticateToken,
  authorizeRole(['ADMIN']),
  authControllers.protectedAdmin
);
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

router.post('/service/forgot-password', authControllers.forgotPassword);
router.post('/service/verify-otp', authControllers.verifyOtp);

export default router;
