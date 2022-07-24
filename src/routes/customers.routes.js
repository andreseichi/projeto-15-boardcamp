import { Router } from 'express';

import {
  getCustomers,
  getCustomerById,
  createCustomer,
} from '../controllers/customersControllers.js';

export const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomerById);
customersRouter.post('/customers', createCustomer);
