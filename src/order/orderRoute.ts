import express, { Router } from 'express';
import { OrderController } from './orderController';
import {
  authenticateToken,
  authorizeRole,
  authorizeUser,
} from '../auth/authMiddleware';
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
  OrderController.getOrderById
);

router.get(
  '/user-order/order/:id',
  authenticateToken,
  authorizeUser,
  OrderController.getOrdersByUserId
);

router.post(
  '/order/checkout/:id',
  authenticateToken,
  authorizeUser,
  OrderController.createOrder
);

export default router;
