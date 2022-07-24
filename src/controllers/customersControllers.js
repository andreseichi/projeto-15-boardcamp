import { connection } from '../databases/postgres.js';

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    if (cpf) {
      const { rows: customers } = await connection.query(
        `SELECT * FROM customers WHERE customers.cpf 
        LIKE $1`,
        [`${cpf}%`]
      );

      return res.send(customers);
    } else {
      const { rows: customers } = await connection.query(
        'SELECT * FROM customers'
      );

      return res.send(customers);
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
