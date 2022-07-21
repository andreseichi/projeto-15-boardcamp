import { Router } from 'express';

import { categoriesRouter } from './categories.routes.js';

export const router = Router();

router.use(categoriesRouter);
