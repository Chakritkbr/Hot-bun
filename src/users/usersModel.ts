import { PrismaClient, User } from '@prisma/client';
import { AppError } from '../middleware/AppError';

const prisma = new PrismaClient();

export class UserModel {
  private static instance: UserModel;

  private constructor() {}
  // การสร้างอินสแตนซ์เดียว (Singleton Pattern)
  public static getInstance(): UserModel {
    if (!UserModel.instance) {
      UserModel.instance = new UserModel();
    }
    return UserModel.instance;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new AppError(500, 'Error while fetching user by email');
    }
  }

  public async getUserById(userId: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw new AppError(500, 'Error while fetching user by id');
    }
  }
  public async createUser(email: string, password: string): Promise<User> {
    try {
      return await prisma.user.create({
        data: {
          email,
          password,
        },
      });
    } catch (error) {
      throw new AppError(500, 'Error while creating user');
    }
  }

  public async updateUser(userId: string, data: Partial<User>): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data,
      });
    } catch (error) {
      throw new AppError(500, 'Error while updating user');
    }
  }

  public async deleteUser(userId: string): Promise<User> {
    try {
      return await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      throw new AppError(500, 'Error while deleting user');
    }
  }
  public async checkUserExists(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user !== null;
    } catch (error) {
      throw new AppError(500, 'Error while checking if user exists');
    }
  }
}

// ฟังก์ชันตรวจสอบว่า user มีในฐานข้อมูลหรือไม่
export const checkUserExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user !== null;
};
export const checkUserIdExists = async (id: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user !== null;
};

export default UserModel;
