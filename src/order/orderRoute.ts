import { cacheClearMiddleware } from './../middleware/cache';
import express, { Router } from 'express';
import { OrderController } from './orderController';
import {
  authenticateToken,
  authorizeRole,
  authorizeUser,
} from '../auth/authMiddleware';
import { cacheMiddleware } from '../middleware/cache';
const router: Router = express.Router();

router.get(
  '/order',
  authenticateToken,
  authorizeRole(['ADMIN']),
  OrderController.getAllOrders
);

router.get(
  '/order/:id/:orderId',
  authenticateToken,
  authorizeUser,
  cacheMiddleware(1800),
  OrderController.getOrderById
);

router.get(
  '/order/:id',
  authenticateToken,
  authorizeUser,
  cacheMiddleware(1800),
  OrderController.getOrdersByUserId
);

router.post(
  '/order/:id',
  authenticateToken,
  authorizeUser,
  cacheClearMiddleware,
  OrderController.createOrder
);

export default router;
