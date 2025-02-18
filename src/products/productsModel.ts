import prisma from '../db';
import { Product } from '@prisma/client';
import { AppError } from '../middleware/AppError';

export class ProductsModel {
  // ใช้ static เพื่อไม่ต้องสร้าง instance ใหม่ในกรณีที่ไม่ต้องการสถานะของอินสแตนซ์
  static async getAll(): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany();
      return products;
    } catch (error) {
      throw new AppError(500, 'Error while fetching products');
    }
  }

  static async getById(id: string): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });
      return product;
    } catch (error) {
      throw new AppError(500, 'Error while fetching product by id');
    }
  }

  static async create(
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> {
    try {
      const newProduct = await prisma.product.create({
        data,
      });
      return newProduct;
    } catch (error) {
      throw new AppError(500, 'Error while creating product');
    }
  }

  static async update(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data,
      });
      return updatedProduct;
    } catch (error) {
      throw new AppError(500, 'Error while updating product');
    }
  }

  static async delete(id: string): Promise<{ message: string }> {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new AppError(500, 'Error while deleting product');
    }
  }

  static async getByCategory(categoryId: string): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        where: { categoryId },
      });
      return products;
    } catch (error) {
      throw new AppError(500, 'Error while fetching products by category');
    }
  }

  static async isNameExist(name: string): Promise<boolean> {
    try {
      const product = await prisma.product.findFirst({
        where: { name },
      });
      return !!product;
    } catch (error) {
      throw new AppError(500, 'Error while checking if product name exists');
    }
  }

  static async isUpdateNameExist(id: string, name: string): Promise<boolean> {
    try {
      const product = await prisma.product.findFirst({
        where: {
          name,
          NOT: { id },
        },
      });
      return !!product;
    } catch (error) {
      throw new AppError(
        500,
        'Error while checking if updated product name exists'
      );
    }
  }
}
