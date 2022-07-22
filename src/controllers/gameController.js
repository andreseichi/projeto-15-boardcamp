import { connection } from '../databases/postgres.js';
import { createGameSchema } from '../schemas/createGameSchema.js';

export async function getGames(req, res) {
  const { name } = req.query;

  try {
    if (name) {
      const { rows: games } = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games JOIN 
        categories ON games."categoryId" = categories.id WHERE games.name 
        ILIKE $1`,
        [`${name}%`]
      );

      if (!games) {
        return res.status(404).json({
          message: 'Nenhum jogo encontrado',
        });
      }

      return res.send(games);
    } else {
      const { rows: games } = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games JOIN 
        categories ON games."categoryId" = categories.id`
      );

      if (!games) {
        return res.status(404).json({
          message: 'Nenhuma categoria encontrada',
        });
      }

      return res.send(games);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function createGames(req, res) {
  try {
    const body = req.body;
    const { name, image, stockTotal, categoryId, pricePerDay } = body;

    const { error } = createGameSchema.validate(body);
    if (error) {
      const errorsMessageArray = error.details.map((error) => error.message);

      console.log(errorsMessageArray);
      return res.sendStatus(400);
    }

    const { rows } = await connection.query(
      'SELECT * FROM games WHERE name = $1',
      [name]
    );
    if (rows.length) {
      return res.sendStatus(409);
    }

    await connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", 
      "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
