import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { router } from './routes/routes.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = express();
server.use(cors(), json());

server.use(router);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
