import express, { Router } from 'express';
import { ProductsController } from './productsController';
import { authenticateToken, authorizeRole } from '../auth/authMiddleware';
import { cache } from '../middleware/cache';

const router: Router = express.Router();

router.get('/products', cache, ProductsController.getAllProducts);
router.get('/products/:id', cache, ProductsController.getProductById);
router.get(
  '/products/category/:categoryId',
  cache,
  ProductsController.getProductsByCategory
);
router.post(
  '/products',
  authenticateToken,
  authorizeRole(['ADMIN']),
  ProductsController.createProduct
);
router.patch(
  '/products/:id',
  authenticateToken,
  authorizeRole(['ADMIN']),
  ProductsController.updateProduct
);
router.delete(
  '/products/:id',
  authenticateToken,
  authorizeRole(['ADMIN']),
  ProductsController.deleteProduct
);

export default router;
