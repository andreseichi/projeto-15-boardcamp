import { Router } from 'express';

import {
  getRentals,
  createRental,
  deleteRental,
} from '../controllers/rentalsController.js';

export const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', createRental);
rentalsRouter.delete('/rentals/:id', deleteRental);
