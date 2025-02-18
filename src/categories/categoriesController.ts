import { Request, Response } from 'express';
import { Categories, CategoriesInterface } from './categoriesModel';
import { categoryValidate } from '../utils/validateUtils';
import { asyncHandler } from '../middleware/asyncHandler';
import { BadRequestError, NotFoundError } from '../middleware/AppError';

export class CategoriesController {
  static create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { error } = categoryValidate.validate(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }

      const { name, description } = req.body;

      const isNameExist = await Categories.isNameExist(name);
      if (isNameExist) {
        throw new BadRequestError('Category name already exists.');
      }

      await Categories.create({ name, description });
      res.status(201).json({
        status: 'success',
        message: 'Category created successfully',
      });
    }
  );

  static getAllCategories = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const categories = await Categories.getAll();
      res.status(200).json({
        status: 'success',
        message: 'Categories retrieved successfully',
        categories,
      });
    }
  );
  static getCategoryById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const category = await Categories.getById(id);
      if (!category) {
        throw new NotFoundError('Category not found');
      }

      res.status(200).json({
        status: 'success',
        message: 'Category retrieved successfully',
        category,
      });
    }
  );

  static updateCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { error } = categoryValidate.validate(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }

      const { id } = req.params;
      const category = await Categories.getById(id);
      if (!category) {
        throw new NotFoundError('Category not found');
      }

      const update: Partial<CategoriesInterface> = req.body;

      if (update.name) {
        const isExist = await Categories.isUpdateNameExist(id, update.name);
        if (isExist) {
          throw new BadRequestError('Category name already exists.');
        }
      }

      await Categories.updateById(id, update);
      res.status(200).json({
        status: 'success',
        message: 'Category updated successfully',
      });
    }
  );

  static deleteCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const category = await Categories.getById(id);
      if (!category) {
        throw new NotFoundError('Category not found');
      }

      await Categories.deleteById(id);
      res.status(200).json({
        status: 'success',
        message: 'Category deleted successfully',
      });
    }
  );
}
