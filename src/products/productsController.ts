import { Request, Response } from 'express';
import { ProductsModel } from './productsModel';
import { productValidate, updateProductValidate } from '../utils/validateUtils';
import { Categories } from '../categories/categoriesModel';
import { asyncHandler } from '../middleware/asyncHandler';
import { BadRequestError, NotFoundError } from '../middleware/AppError';
import redis from '../utils/redis';

export class ProductsController {
  static getAllProducts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const products = await ProductsModel.getAll();
      res.status(200).json({
        status: 'success',
        message: 'Products retrieved successfully',
        products,
      });
    }
  );

  static getProductById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const product = await ProductsModel.getById(id);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      res.status(200).json({
        status: 'success',
        message: 'Product retrieved successfully',
        product,
      });
    }
  );

  static getProductsByCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { categoryId } = req.params;
      const category = await Categories.getById(categoryId);
      if (!category) {
        throw new NotFoundError('No products found for this category');
      }
      const products = await ProductsModel.getByCategory(categoryId);

      res.status(200).json({
        status: 'success',
        message: 'Products retrieved successfully',
        products,
      });
    }
  );

  static createProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { error } = productValidate.validate(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }
      const { name, description, price, stock, categoryId } = req.body;

      const isNameExist = await ProductsModel.isNameExist(name);
      if (isNameExist) {
        throw new BadRequestError('Product name is already in use.');
      }
      if (categoryId) {
        const categoryExists = await Categories.getById(categoryId);
        if (!categoryExists) {
          throw new BadRequestError('Category does not exist ');
        }
      }
      const newProduct = await ProductsModel.create({
        name,
        description,
        price,
        stock,
        categoryId,
      });
      res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        newProduct,
      });
    }
  );

  static updateProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { error } = updateProductValidate.validate(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }
      const { id } = req.params;
      const product = await ProductsModel.getById(id);
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      const isUpdateNameExist = await ProductsModel.isUpdateNameExist(
        id,
        req.body.name
      );
      if (isUpdateNameExist) {
        throw new BadRequestError('Product name is already in use.');
      }
      const updatedProduct = await ProductsModel.update(id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        updatedProduct,
      });
    }
  );

  static deleteProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const product = await ProductsModel.getById(id);
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      await ProductsModel.delete(id);
      res
        .status(200)
        .json({ status: 'success', message: 'Product deleted successfully' });
    }
  );
}
