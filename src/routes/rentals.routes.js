import { Router } from 'express';

import {
  getRentals,
  createRental,
  returnRental,
  deleteRental,
} from '../controllers/rentalsController.js';

export const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', createRental);
rentalsRouter.post('/rentals/:id/return', returnRental);
rentalsRouter.delete('/rentals/:id', deleteRental);
