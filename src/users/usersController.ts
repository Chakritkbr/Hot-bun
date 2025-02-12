import { Request, Response } from 'express';
import { userValidate } from '../utils/validateUtils';
import { hashPassword, checkPassword, genToken } from '../auth/authUtils';
import UserModel from './usersModel';

// การลงทะเบียนผู้ใช้ใหม่
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const { error } = userValidate.validate({ email, password });
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  try {
    const userModel = UserModel.getInstance();
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use.' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user = await userModel.createUser(email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    console.error('Error in register user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
// การล็อกอินผู้ใช้
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const { error } = userValidate.validate({ email, password });
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  try {
    const userModel = UserModel.getInstance();
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      res.status(400).json({ message: 'Invalid email or password.' });
      return;
    }

    const isPasswordValid = await checkPassword(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = genToken({ id: user.id, email: user.email });

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// การอัพเดตข้อมูลผู้ใช้
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, newPassword } = req.body;
  const userId = req.params.id;

  // ตรวจสอบข้อมูลที่ได้รับ
  const { error } = userValidate.validate({ email, password, newPassword });
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  try {
    const userModel = UserModel.getInstance();
    const user = await userModel.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // ตรวจสอบว่ารหัสผ่านเดิมถูกต้องหรือไม่
    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid password.' });
      return;
    }

    // แฮชรหัสผ่านใหม่ถ้ามีการอัพเดต
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
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// การลบข้อมูลผู้ใช้
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;

  try {
    const userModel = UserModel.getInstance();
    const user = await userModel.getUserByEmail(req.body.email);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const deletedUser = await userModel.deleteUser(userId);

    res
      .status(200)
      .json({ message: 'User deleted successfully.', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
