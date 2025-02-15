import { Response, Request } from 'express';
import { CartModel } from './cartModel';
import { Product } from '@prisma/client';
import { ProductsModel } from '../products/productsModel';

export class CartController {
  static async getCartByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const cart = await CartModel.getCartByUserId(userId);
      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }
      res.status(200).json({ message: 'Cart retrieved successfully', cart });
    } catch (error) {
      res.status(500).json({ message: 'Error while fetching cart', error });
    }
  }

  static async addItemToCart(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { productId, quantity } = req.body;

      const product = await ProductsModel.getById(productId);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      if (product.stock < quantity) {
        res.status(400).json({ message: 'Not enough stock' });
        return;
      }

      let cart = await CartModel.getCartByUserId(userId);
      if (!cart) {
        cart = await CartModel.createCart(userId);
      }

      const cartItem = await CartModel.addItemToCart(
        cart.id,
        productId,
        quantity
      );

      res
        .status(201)
        .json({ message: 'Item added to cart successfully', cartItem });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error while adding item to cart', error });
    }
  }

  static async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;
      const cartItem = await CartModel.isCartItemExists(cartItemId);
      if (quantity <= 0) {
        res.status(400).json({ message: 'Quantity must be greater than 0' });
        return;
      }
      if (!cartItem) {
        res.status(404).json({ message: 'Cart item not found' });
        return;
      }

      const product = await ProductsModel.getById(cartItem.productId);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      if (product.stock < quantity) {
        res.status(400).json({ message: 'Not enough stock' });
        return;
      }
      await CartModel.updateCartItem(cartItemId, quantity);
      res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error while updating cart item', error });
    }
  }

  static async removeCartItem(req: Request, res: Response): Promise<void> {
    try {
      const { cartItemId } = req.params;
      const cartItem = await CartModel.isCartItemExists(cartItemId);
      if (!cartItem) {
        res.status(404).json({ message: 'Cart item not found' });
        return;
      }
      await CartModel.removeItemFromCart(cartItemId);
      res.status(200).json({ message: 'Cart item removed successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error while removing cart item', error });
    }
  }

  static async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const cart = await CartModel.getCartByUserId(userId);
      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }
      await CartModel.clearCart(cart.id);
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error while clearing cart', error });
    }
  }

  static async getCartItemsByCartId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { cartId } = req.params; // รับ cartId จาก URL params
      const cart = await CartModel.isCartExists(cartId); // เรียกใช้ฟังก์ชันที่ปรับปรุงแล้ว
      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }
      const cartItems = await CartModel.getCartItemsByCartId(cartId); // เรียกใช้ฟังก์ชันที่ปรับปรุงแล้ว
      if (cartItems.length === 0) {
        res.status(404).json({ message: 'No cart items found' });
        return;
      }
      res
        .status(200)
        .json({ message: 'Cart items retrieved successfully', cartItems });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error while fetching cart items', error });
    }
  }
}
