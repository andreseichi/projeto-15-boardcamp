import { Router } from 'express';

import {
  createRental,
  deleteRental,
} from '../controllers/rentalsController.js';

export const rentalsRouter = Router();

// rentalsRouter.get('/rentals', createRental);
rentalsRouter.post('/rentals', createRental);
rentalsRouter.delete('/rentals/:id', deleteRental);
