import prisma from '../db';
import { Cart, CartItem } from '@prisma/client';

export class CartModel {
  static async getCartByUserId(userId: string): Promise<Cart | null> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          CartItem: {
            include: {
              product: true,
            },
          },
        },
      });
      return cart;
    } catch (error) {
      throw new Error(
        'Error while fetching cart: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async createCart(userId: string): Promise<Cart> {
    try {
      const newCart = await prisma.cart.create({
        data: { userId },
      });
      return newCart;
    } catch (error) {
      throw new Error(
        'Error while creating cart: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async addItemToCart(
    cartId: string,
    productId: string,
    quantity: number
  ): Promise<CartItem> {
    try {
      const cartItem = await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity,
        },
      });
      return cartItem;
    } catch (error) {
      throw new Error(
        'Error while adding item to cart: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async updateCartItem(
    cartItemId: string,
    quantity: number
  ): Promise<CartItem> {
    try {
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });

      return updatedCartItem;
    } catch (error) {
      throw new Error(
        'Error while updating cart item: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async removeItemFromCart(cartItemId: string): Promise<void> {
    try {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } catch (error) {
      throw new Error(
        'Error while removing item from cart: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async clearCart(cartId: string): Promise<void> {
    try {
      await prisma.cartItem.deleteMany({
        where: { cartId },
      });
    } catch (error) {
      throw new Error(
        'Error while clearing cart: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async isCartExists(cartId: string): Promise<Boolean> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
      });
      return cart ? true : false;
    } catch (error) {
      throw new Error(
        'Error Cart not found: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async isCartItemExists(cartItemId: string): Promise<CartItem | null> {
    try {
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });
      return cartItem;
    } catch (error) {
      throw new Error(
        'Error CartItem not found: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async getCartItemsByCartId(cartId: string): Promise<CartItem[]> {
    try {
      // ตรวจสอบว่ามี CartItem ที่มี cartId ที่ตรงกันในฐานข้อมูลหรือไม่
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { CartItem: { include: { product: true } } }, // รวมข้อมูล CartItem
      });

      if (!cart || !cart.CartItem.length) {
        throw new Error('Cart not found or no cart items available');
      }

      return cart.CartItem; // ส่งกลับ CartItem ทั้งหมด
    } catch (error) {
      throw new Error(
        'Error while fetching cart items: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async updateMutipleCartItems(
    cartId: string,
    cartItems: { cartItemId: string; quantity: number }[]
  ): Promise<CartItem[]> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { CartItem: true },
      });

      if (!cart) {
        throw new Error('Cart not found');
      }

      const invalidItems = cartItems.filter(
        (item) => !cart.CartItem.some((ci) => ci.id === item.cartItemId)
      );

      if (invalidItems.length > 0) {
        throw new Error(
          `Some cart items not found in this cart: ${invalidItems
            .map((i) => i.cartItemId)
            .join(', ')}`
        );
      }

      return await prisma.$transaction(
        cartItems.map(({ cartItemId, quantity }) =>
          prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
          })
        )
      );
    } catch (error) {
      throw new Error(
        'Error while updating multiple cart items: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async getCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findFirst({
      where: { cartId, productId },
    });
  }
}
