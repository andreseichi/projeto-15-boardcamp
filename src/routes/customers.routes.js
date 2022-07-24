import { Router } from 'express';

import { getCustomers } from '../controllers/customersControllers.js';

export const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
