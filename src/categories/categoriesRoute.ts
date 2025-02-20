import express, { Router } from 'express';
import { CategoriesController } from './categoriesController';
import { authenticateToken, authorizeRole } from '../auth/authMiddleware';
import { cacheClearMiddleware, cacheMiddleware } from '../middleware/cache';

const router: Router = express.Router();

router.post(
  '/categories',
  authenticateToken,
  authorizeRole(['ADMIN']),
  cacheClearMiddleware,
  CategoriesController.create
);

router.get(
  '/categories',
  cacheMiddleware(),
  CategoriesController.getAllCategories
);

router.get(
  '/categories/:id',
  cacheMiddleware(),
  CategoriesController.getCategoryById
);

router.patch(
  '/categories/:id',
  authenticateToken,
  authorizeRole(['ADMIN']),
  cacheClearMiddleware,
  CategoriesController.updateCategory
);

router.delete(
  '/categories/:id',
  authenticateToken,
  authorizeRole(['ADMIN']),
  cacheClearMiddleware,
  CategoriesController.deleteCategory
);

export default router;
