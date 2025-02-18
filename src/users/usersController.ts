import { Request, Response } from 'express';
import { userValidate } from '../utils/validateUtils';
import { hashPassword, checkPassword, genToken } from '../auth/authUtils';
import UserModel from './usersModel';
import { BadRequestError } from '../middleware/AppError';
import { asyncHandler } from '../middleware/asyncHandler';

// การลงทะเบียนผู้ใช้ใหม่
export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { error } = userValidate.validate({ email, password });
    if (error) {
      throw new BadRequestError(error.details[0].message); // ส่ง BadRequestError เมื่อมี validation error
    }

    const userModel = UserModel.getInstance();
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      throw new BadRequestError('Email is already in use.');
    }

    const hashedPassword = await hashPassword(password);
    const user = await userModel.createUser(email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully.', user });
  }
);
// การล็อกอินผู้ใช้
export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { error } = userValidate.validate({ email, password });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const userModel = UserModel.getInstance();
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      throw new BadRequestError('Invalid email or password.');
    }

    const isPasswordValid = await checkPassword(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestError('Invalid email or password.');
    }

    const token = genToken({ id: user.id, email: user.email });

    res.status(200).json({ message: 'Login successful.', token });
  }
);

// การอัพเดตข้อมูลผู้ใช้
export const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, newPassword } = req.body;
    const userId = req.params.id;

    const { error } = userValidate.validate({ email, password, newPassword });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const userModel = UserModel.getInstance();
    const user = await userModel.getUserById(userId);

    if (!user) {
      throw new BadRequestError('User not found.');
    }

    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid password.');
    }

    let updatedPassword = user.password;
    if (newPassword) {
      updatedPassword = await hashPassword(newPassword);
    }

    const updatedUser = await userModel.updateUser(userId, {
      email,
      password: updatedPassword,
    });

    res
      .status(200)
      .json({ message: 'User updated successfully.', user: updatedUser });
  }
);

// การลบข้อมูลผู้ใช้
export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    const userModel = UserModel.getInstance();
    const user = await userModel.getUserByEmail(req.body.email);

    if (!user) {
      throw new BadRequestError('User not found.');
    }

    const deletedUser = await userModel.deleteUser(userId);

    res
      .status(200)
      .json({ message: 'User deleted successfully.', user: deletedUser });
  }
);
