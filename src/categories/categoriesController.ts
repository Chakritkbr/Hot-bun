import { Request, Response } from 'express';
import { Categories, CategoriesInterface } from './categoriesModel';
import { categoryValidate } from '../utils/validateUtils';

export class CategoriesController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { error } = categoryValidate.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const { name, description } = req.body;

      const isNameExist = await Categories.isNameExist(name);
      if (isNameExist) {
        res.status(400).json({ message: 'Name already exists' });
        return;
      }
      await Categories.create({ name, description });
      res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Categories.getAll();
      res
        .status(200)
        .json({ message: 'Categories retrieved successfully', categories });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await Categories.getById(id);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
      }
      res
        .status(200)
        .json({ message: 'Category retrieved successfully', category });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { error } = categoryValidate.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const { id } = req.params;
      const category = await Categories.getById(id);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
      }
      const update: Partial<CategoriesInterface> = req.body;

      if (update.name) {
        const isExist = await Categories.isUpdateNameExist(id, update.name);
        if (isExist) {
          res.status(400).json({ message: 'Name already exists' });
        }
      }
      await Categories.updateById(id, update);
      res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await Categories.getById(id);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
      }
      await Categories.deleteById(id);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
