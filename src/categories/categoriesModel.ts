import prisma from '../db';

export interface CategoriesInterface {
  id?: string;
  name: string;
  description: string | null;
}

export class Categories {
  static async create(category: CategoriesInterface): Promise<void> {
    await prisma.category.create({
      data: {
        name: category.name,
        description: category.description,
      },
    });
  }

  static async getAll(): Promise<CategoriesInterface[]> {
    return prisma.category.findMany();
  }

  static async getById(id: string): Promise<CategoriesInterface | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  static async updateById(
    id: string,
    update: Partial<CategoriesInterface>
  ): Promise<void> {
    if (Object.keys(update).length === 0) {
      throw new Error('No fields update');
    }
    await prisma.category.update({
      where: { id },
      data: update,
    });
  }

  static async deleteById(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
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
