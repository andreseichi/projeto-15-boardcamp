import { Router } from 'express';

import { getGames, createGames } from '../controllers/gameController.js';

export const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', createGames);
