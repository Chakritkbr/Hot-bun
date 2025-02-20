import express, { Router } from 'express';
import { authenticateToken } from '../auth/authMiddleware';
import { CartController } from './cartController';
import { cacheClearMiddleware, cacheMiddleware } from '../middleware/cache';

const router: Router = express.Router();

router.get(
  '/cart/:userId',
  authenticateToken,
  cacheMiddleware(),
  CartController.getCartByUserId
);
router.post(
  '/cart/:userId',
  authenticateToken,
  cacheClearMiddleware,
  CartController.addItemToCart
);
router.get(
  '/cart/items/:cartId',
  authenticateToken,
  cacheMiddleware(),
  CartController.getCartItemsByCartId
);
router.patch(
  '/cart/items/:cartId',
  authenticateToken,
  cacheClearMiddleware,
  CartController.updateCartItem
);
router.patch(
  '/cart/items/:cartId',
  authenticateToken,
  cacheClearMiddleware,
  CartController.updateMultipleCartItems
);
router.delete(
  '/cart/items/:cartItemId',
  authenticateToken,
  cacheClearMiddleware,
  CartController.removeCartItem
);
router.delete(
  '/cart/:userId',
  authenticateToken,
  cacheClearMiddleware,
  CartController.clearCart
);

export default router;
