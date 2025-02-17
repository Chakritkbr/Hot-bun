import prisma from '../db';
import { Order, OrderItem } from '@prisma/client';

export class OrderModel {
  static async createOrder(userId: string): Promise<Order> {
    return await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { CartItem: { include: { product: true } } },
      });
      if (!cart || cart.CartItem.length === 0) {
        throw new Error('Cart is empty or not found');
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
  }

  static async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
    });

    if (!orders || orders.length === 0) {
      throw new Error('No orders found');
    }

    return orders;
  }
  static async getOrderById(orderId: string): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { product: true } } },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  static async getAllOrder(): Promise<Order[]> {
    return await prisma.order.findMany();
  }
}
