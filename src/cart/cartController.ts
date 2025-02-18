import { checkUserIdExists } from './../users/usersModel';
import { Response, Request } from 'express';
import { CartModel } from './cartModel';
import { ProductsModel } from '../products/productsModel';
import prisma from '../db';
import { asyncHandler } from '../middleware/asyncHandler';
import { BadRequestError, NotFoundError } from '../middleware/AppError';

export class CartController {
  static getCartByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = req.params;
      const cart = await CartModel.getCartByUserId(userId);
      if (!cart) {
        throw new NotFoundError('Cart not found');
      }
      res.status(200).json({
        status: 'success',
        message: 'Cart retrieved successfully',
        cart,
      });
    }
  );

  static addItemToCart = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = req.params;
      const { productId, quantity } = req.body;
      const user = await checkUserIdExists(userId);
      console.log(user);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      const product = await ProductsModel.getById(productId);
      if (!product || product.stock < quantity) {
        throw new BadRequestError(
          product ? 'Not enough stock' : 'Product not found'
        );
      }

      let cart = await CartModel.getCartByUserId(userId);
      if (!cart) {
        cart = await CartModel.createCart(userId);
      }

      let existingCartItem = await CartModel.getCartItem(cart.id, productId);

      if (existingCartItem) {
        // Update quantity if item exists
        const newQuantity = existingCartItem.quantity + quantity;
        if (newQuantity > product.stock) {
          throw new BadRequestError('Not enough stock');
        }

        existingCartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: newQuantity },
        });
      } else {
        // Create new item if not exists
        existingCartItem = await prisma.cartItem.create({
          data: { cartId: cart.id, productId, quantity },
        });
      }

      res.status(201).json({
        status: 'success',
        message: 'Item added to cart successfully',
        existingCartItem,
      });
    }
  );

  static updateCartItem = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { cartItemId } = req.params;
      const { quantity } = req.body;

      if (quantity <= 0) {
        throw new BadRequestError('Quantity must be greater than 0');
      }

      const cartItem = await CartModel.isCartItemExists(cartItemId);
      if (!cartItem) {
        throw new NotFoundError('Cart item not found');
      }

      const product = await ProductsModel.getById(cartItem.productId);
      if (!product || product.stock < quantity) {
        throw new BadRequestError('Not enough stock');
      }

      await CartModel.updateCartItem(cartItemId, quantity);
      res.status(200).json({
        status: 'success',
        message: 'Cart item updated successfully',
      });
    }
  );

  static removeCartItem = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { cartItemId } = req.params;

      const cartItem = await CartModel.isCartItemExists(cartItemId);
      if (!cartItem) {
        throw new NotFoundError('Cart item not found');
      }

      await CartModel.removeItemFromCart(cartItemId);
      res.status(200).json({
        status: 'success',
        message: 'Cart item removed successfully',
      });
    }
  );

  static clearCart = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = req.params;
      const cart = await CartModel.getCartByUserId(userId);
      if (!cart) {
        throw new NotFoundError('Cart not found');
      }
      await CartModel.clearCart(cart.id);
      res.status(200).json({
        status: 'success',
        message: 'Cart cleared successfully',
      });
    }
  );

  static getCartItemsByCartId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { cartId } = req.params;
      const cart = await CartModel.isCartExists(cartId);
      if (!cart) {
        throw new NotFoundError('Cart not found');
      }
      const cartItems = await CartModel.getCartItemsByCartId(cartId);
      if (cartItems.length === 0) {
        throw new NotFoundError('No cart items found');
      }
      res.status(200).json({
        status: 'success',
        message: 'Cart items retrieved successfully',
        cartItems,
      });
    }
  );

  static updateMultipleCartItems = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { cartId } = req.params;
      const { cartItems } = req.body;

      if (!cartId) {
        throw new BadRequestError('Cart ID is required');
      }

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new BadRequestError('Invalid cart payload');
      }

      const updatedCartItems = await CartModel.updateMutipleCartItems(
        cartId,
        cartItems
      );
      res.status(200).json({
        status: 'success',
        message: 'Cart items updated successfully',
        updatedCartItems,
      });
    }
  );
}
