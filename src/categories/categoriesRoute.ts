import express, { Router } from 'express';
import { CategoriesController } from './categoriesController';
import { authenticateToken, authorizeRole } from '../auth/authMiddleware';

const router: Router = express.Router();

router.post(
  '/categories',
  authenticateToken,
  authorizeRole(['ADMIN']),
  CategoriesController.create
);

router.get('/categories', CategoriesController.getAllCategories);

router.get('/categories/:id', CategoriesController.getCategoryById);

router.patch(
  '/categories/:id',
  authenticateToken,
  authorizeRole(['ADMIN']),
  CategoriesController.updateCategory
);

router.delete(
  '/categories/:id',
  authenticateToken,
  authorizeRole(['ADMIN']),
  CategoriesController.deleteCategory
);

export default router;
