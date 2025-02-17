import Joi from 'joi';

export const userValidate = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('(?=.*[A-Z])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter.',
    }),
  newPassword: Joi.string()
    .min(6)
    .pattern(new RegExp('(?=.*[A-Z])'))
    .optional() // newPassword ไม่จำเป็นต้องมี แต่ถ้ามีจะต้องผ่านการตรวจสอบ
    .messages({
      'string.min': 'New password must be at least 6 characters long.',
      'string.pattern.base':
        'New password must contain at least one uppercase letter.',
    }),
});

export const authEmailValidate = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'any.required': 'Email is required.',
  }),
});

export const authPasswordResetValidate = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'any.required': 'Email is required.',
  }),
  newPassword: Joi.string()
    .min(6)
    .pattern(new RegExp('(?=.*[A-Z])'))
    .required()
    .messages({
      'string.min': 'New password must be at least 6 characters long.',
      'string.pattern.base':
        'New password must contain at least one uppercase letter.',
      'any.required': 'New password is required.',
    }),
});

export const categoryValidate = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Category name must be a string',
    'string.empty': 'Category name cannot be empty',
    'any.required': 'Category name is required',
  }),
  description: Joi.string().required().allow('').messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description cannot be empty',
    'any.required': 'Description is required',
  }),
});

export const discountValidate = Joi.object({
  code: Joi.string().max(50).required(),
  percentage: Joi.number().min(0).max(100).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().min(Joi.ref('start_date')).required(),
});

export const productValidate = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name cannot be empty',
    'any.required': 'Product name is required',
  }),
  description: Joi.string().allow('').messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description cannot be empty',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
    'any.required': 'Price is required',
  }),
  stock: Joi.number().min(0).required().messages({
    'number.base': 'Stock must be a number',
    'number.min': 'Stock must be at least 0',
    'any.required': 'Stock is required',
  }),
  categoryId: Joi.string().optional().allow(null).messages({
    'string.base': 'Category ID must be a string',
  }),
});

export const updateProductValidate = Joi.object({
  name: Joi.string().optional().messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name cannot be empty',
  }),
  description: Joi.string().optional().allow('').messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description cannot be empty',
  }),
  price: Joi.number().optional().min(0).messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
  }),
  stock: Joi.number().optional().min(0).messages({
    'number.base': 'Stock must be a number',
    'number.min': 'Stock must be at least 0',
  }),
  categoryId: Joi.string().optional().allow(null).messages({
    'string.base': 'Category ID must be a string',
  }),
});
