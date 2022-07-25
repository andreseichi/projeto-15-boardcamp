import { Router } from 'express';

import { createRental } from '../controllers/rentalsController.js';

export const rentalsRouter = Router();

// rentalsRouter.get('/rentals', createRental);
rentalsRouter.post('/rentals', createRental);
