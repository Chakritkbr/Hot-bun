import { Request, Response } from 'express';
import { ProductsModel } from './productsModel';
import { productValidate, updateProductValidate } from '../utils/validateUtils';
import { Categories } from '../categories/categoriesModel';

export class ProductsController {
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductsModel.getAll();
      res
        .status(200)
        .json({ message: 'Products retrieved successfully', products });
    } catch (error) {
      res.status(500).json({ message: 'Error while fetching products' });
    }
  }

  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductsModel.getById(id);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res
        .status(200)
        .json({ message: 'Product retrieved successfully', product });
    } catch (error) {
      res.status(500).json({ message: 'Error while fetching product by id' });
    }
  }

  static async getProductsByCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { categoryId } = req.params;
      const category = await Categories.getById(categoryId);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      const products = await ProductsModel.getByCategory(categoryId);
      res
        .status(200)
        .json({ message: 'Products retrieved successfully', products });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error while fetching products by category' });
    }
  }

  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { error } = productValidate.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      const { name, description, price, stock, categoryId } = req.body;

      const isNameExist = await ProductsModel.isNameExist(name);
      if (isNameExist) {
        res.status(400).json({ message: 'Name already exists' });
        return;
      }
      if (categoryId) {
        const categoryExists = await Categories.getById(categoryId);
        if (!categoryExists) {
          res.status(400).json({ message: 'Category does not exist' });
          return;
        }
      }
      const newProduct = await ProductsModel.create({
        name,
        description,
        price,
        stock,
        categoryId,
      });
      res
        .status(201)
        .json({ message: 'Product created successfully', newProduct });
    } catch (error) {
      res.status(500).json({ message: 'Error while creating product' });
    }
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { error } = updateProductValidate.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      const { id } = req.params;
      const product = await ProductsModel.getById(id);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      const isUpdateNameExist = await ProductsModel.isUpdateNameExist(
        id,
        req.body.name
      );
      if (isUpdateNameExist) {
        res.status(400).json({ message: 'Name already exists' });
        return;
      }
      const updatedProduct = await ProductsModel.update(id, req.body);
      res
        .status(200)
        .json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
      res.status(500).json({ message: 'Error while updating product' });
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductsModel.getById(id);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      await ProductsModel.delete(id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error while deleting product' });
    }
  }
}
