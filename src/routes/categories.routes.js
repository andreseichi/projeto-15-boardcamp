import { Router } from 'express';

import { getCategories } from '../controllers/categoriesController.js';

export const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
