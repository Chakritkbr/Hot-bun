import { Request, Response } from 'express';
import { OrderModel } from './orderModel';
import { CustomUserRequest } from '../auth/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { NotFoundError, UnauthorizedError } from '../middleware/AppError';

export class OrderController {
  static getAllOrders = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const orders = await OrderModel.getAllOrder();
      res.status(200).json({
        status: 'success',
        message: 'Get all orders successfully',
        orders,
      });
    }
  );
  static getOrderById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { orderId } = req.params;
      const order = await OrderModel.getOrderById(orderId);
      if (!order) {
        throw new NotFoundError('Order not found');
      }
      res.status(200).json({
        status: 'success',
        message: 'Get order successfully',
        order,
      });
    }
  );

  static createOrder = asyncHandler(
    async (req: CustomUserRequest, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('Unauthorized');
      }

      const order = await OrderModel.createOrder(userId);
      res.status(201).json({
        status: 'success',
        message: 'Create order successfully',
        order,
      });
    }
  );
  static getOrdersByUserId = asyncHandler(
    async (req: CustomUserRequest, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('Unauthorized');
      }

      const orders = await OrderModel.getOrdersByUserId(userId);
      res.status(200).json({
        status: 'success',
        orders,
      });
    }
  );
}
