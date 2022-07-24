import { Router } from 'express';

import {
  getCustomers,
  createCustomer,
} from '../controllers/customersControllers.js';

export const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.post('/customers', createCustomer);
