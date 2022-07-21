import { Router } from 'express';

import {
  createCategory,
  getCategories,
} from '../controllers/categoriesController.js';

export const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', createCategory);
