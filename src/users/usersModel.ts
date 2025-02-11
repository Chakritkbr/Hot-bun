import { PrismaClient, User } from '@prisma/client';

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
      throw new Error('Error while fetching user by email');
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
      throw new Error('Error while fetching user by id');
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
      throw new Error('Error while creating user');
    }
  }

  public async updateUser(userId: string, data: Partial<User>): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data,
      });
    } catch (error) {
      throw new Error('Error while updating user');
    }
  }

  public async deleteUser(userId: string): Promise<User> {
    try {
      return await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      throw new Error('Error while deleting user');
    }
  }
  public getPrisma(): PrismaClient {
    return prisma;
  }
}

// ฟังก์ชันตรวจสอบว่า user มีในฐานข้อมูลหรือไม่
export const checkUserExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user !== null;
};

export default UserModel;
