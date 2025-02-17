import { Request, Response } from 'express';
import { OrderModel } from './orderModel';
import { CartModel } from '../cart/cartModel';
import { ProductsModel } from '../products/productsModel';
import { CustomUserRequest } from '../auth/authMiddleware';

export class OrderController {
  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await OrderModel.getAllOrder();
      res.status(200).json({
        status: 'success',
        message: 'Get all orders successfully',
        orders,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await OrderModel.getOrderById(orderId);
      res.status(200).json({
        status: 'success',
        message: 'Get order successfully',
        order,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async createOrder(
    req: CustomUserRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
        return;
      }

      const order = await OrderModel.createOrder(userId);
      res.status(201).json({
        status: 'success',
        message: 'Create order successfully',
        order,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  static async getOrdersByUserId(req: CustomUserRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
        return;
      }
      const orders = await OrderModel.getOrdersByUserId(userId);
      res.status(200).json({
        status: 'success',
        orders,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
