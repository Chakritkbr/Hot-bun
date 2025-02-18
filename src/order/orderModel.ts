import prisma from '../db';
import { Order, OrderItem } from '@prisma/client';
import { AppError, NotFoundError } from '../middleware/AppError';

export class OrderModel {
  static async createOrder(userId: string): Promise<Order> {
    try {
      return await prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
          where: { userId },
          include: { CartItem: { include: { product: true } } },
        });
        if (!cart || cart.CartItem.length === 0) {
          throw new NotFoundError('Cart is empty or not found');
        }

        const totalPrice = cart.CartItem.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );

        const order = await tx.order.create({
          data: {
            userId,
            status: 'PENDING',
            total: totalPrice,
          },
        });

        const orderItems = cart.CartItem.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        }));

        await tx.orderItem.createMany({ data: orderItems });
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return order;
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError(500, 'Error while creating order');
    }
  }

  static async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: { orderItems: { include: { product: true } } },
      });

      if (!orders || orders.length === 0) {
        throw new NotFoundError('No orders found');
      }

      return orders;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError(500, 'Error while fetching orders');
    }
  }

  static async getOrderById(orderId: string): Promise<Order> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: { include: { product: true } } },
      });

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError(500, 'Error while fetching order');
    }
  }

  static async getAllOrder(): Promise<Order[]> {
    try {
      const orders = await prisma.order.findMany();
      return orders;
    } catch (error) {
      throw new AppError(500, 'Error while fetching all orders');
    }
  }
}
