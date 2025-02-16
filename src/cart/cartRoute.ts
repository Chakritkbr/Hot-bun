import express, { Router } from 'express';
import { authenticateToken } from '../auth/authMiddleware';
import { CartController } from './cartController';

const router: Router = express.Router();

router.get('/cart/:userId', authenticateToken, CartController.getCartByUserId);
router.get(
  '/cart/items/:cartId',
  authenticateToken,
  CartController.getCartItemsByCartId
);
router.post(
  '/cart/:userId/items',
  authenticateToken,
  CartController.addItemToCart
);
router.patch(
  '/cart/items/:cartItemId',
  authenticateToken,
  CartController.updateCartItem
);
router.patch(
  '/cart/cart-items/:cartId',
  authenticateToken,
  CartController.updateMultipleCartItems
);
router.delete(
  '/cart/items/:cartItemId',
  authenticateToken,
  CartController.removeCartItem
);
router.delete('/cart/:userId', authenticateToken, CartController.clearCart);

export default router;
