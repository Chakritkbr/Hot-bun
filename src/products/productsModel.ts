import prisma from '../db';
import { Product } from '@prisma/client';

export class ProductsModel {
  // ใช้ static เพื่อไม่ต้องสร้าง instance ใหม่ในกรณีที่ไม่ต้องการสถานะของอินสแตนซ์
  static async getAll(): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany();
      return products;
    } catch (error) {
      throw new Error(
        'Error while fetching products: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async getById(id: string): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });
      return product;
    } catch (error) {
      throw new Error(
        'Error while fetching product: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
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
      throw new Error(
        'Error while creating product: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
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
      throw new Error(
        'Error while updating product: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async delete(id: string): Promise<{ message: string }> {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new Error(
        'Error while deleting product: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async getByCategory(categoryId: string): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        where: { categoryId },
      });
      return products;
    } catch (error) {
      throw new Error(
        'Error while fetching products by category: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  static async isNameExist(name: string): Promise<boolean> {
    try {
      const product = await prisma.product.findFirst({
        where: { name },
      });
      return !!product;
    } catch (error) {
      throw new Error(
        'Error while checking if product name exists: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
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
      throw new Error(
        'Error while checking if updated product name exists: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }
}
