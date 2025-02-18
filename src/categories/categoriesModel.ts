import prisma from '../db';
import { AppError, BadRequestError } from '../middleware/AppError';

export interface CategoriesInterface {
  id?: string;
  name: string;
  description: string | null;
}

export class Categories {
  static async create(category: CategoriesInterface): Promise<void> {
    try {
      await prisma.category.create({
        data: {
          name: category.name,
          description: category.description,
        },
      });
    } catch (error) {
      throw new AppError(500, 'Error while creating category');
    }
  }

  static async getAll(): Promise<CategoriesInterface[]> {
    try {
      return await prisma.category.findMany();
    } catch (error) {
      throw new AppError(500, 'Error while fetching categories');
    }
  }

  static async getById(id: string): Promise<CategoriesInterface | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
      });
      return category;
    } catch (error) {
      throw new AppError(500, 'Error while fetching category by ID');
    }
  }

  static async updateById(
    id: string,
    update: Partial<CategoriesInterface>
  ): Promise<void> {
    if (Object.keys(update).length === 0) {
      throw new BadRequestError('No fields to update');
    }
    await prisma.category.update({
      where: { id },
      data: update,
    });
  }

  static async deleteById(id: string): Promise<void> {
    try {
      await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError(500, 'Error while deleting category');
    }
  }

  static async isNameExist(name: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: { name },
    });
    return count > 0;
  }

  static async isUpdateNameExist(id: string, name: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: { name, id: { not: id } },
    });
    return count > 0;
  }
}
