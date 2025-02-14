import express, { Router } from 'express';
import { ProductsController } from './productsController';
import { authenticateToken, authorizeRole } from '../auth/authMiddleware';

const router: Router = express.Router();

router.get('/products', ProductsController.getAllProducts);
router.get('/products/:id', ProductsController.getProductById);
router.get(
  '/products/category/:categoryId',
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
