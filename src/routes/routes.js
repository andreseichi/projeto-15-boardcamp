import { Router } from 'express';

import { categoriesRouter } from './categories.routes.js';
import { customersRouter } from './customers.routes.js';
import { gamesRouter } from './games.routes.js';

export const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customersRouter);
