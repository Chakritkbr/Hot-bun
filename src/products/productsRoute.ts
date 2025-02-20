import express, { Router } from 'express';
import { ProductsController } from './productsController';
import { authenticateToken, authorizeRole } from '../auth/authMiddleware';
import { cacheClearMiddleware, cacheMiddleware } from '../middleware/cache';

const router: Router = express.Router();

router.get('/products', cacheMiddleware(), ProductsController.getAllProducts);
router.get(
  '/products/:id',
  cacheMiddleware(),
  ProductsController.getProductById
);
router.get(
  '/products/category/:categoryId',
  cacheMiddleware(),
  ProductsController.getProductsByCategory
);
router.post(
  '/products',
  authenticateToken,
  authorizeRole(['ADMIN']),
  cacheClearMiddleware,
  ProductsController.createProduct
);
router.patch(
  '/products/:id',
  authenticateToken,
  authorizeRole(['ADMIN']),
  cacheClearMiddleware,
  ProductsController.updateProduct
);
router.delete(
  '/products/:id',
  authenticateToken,
  authorizeRole(['ADMIN']),
  cacheClearMiddleware,
  ProductsController.deleteProduct
);

export default router;
