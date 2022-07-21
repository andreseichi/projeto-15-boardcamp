import { connection } from '../databases/postgres.js';
import { createCategorySchema } from '../schemas/createCategory.js';

export async function getCategories(req, res) {
  try {
    const response = await connection.query('SELECT * FROM categories');
    const { rows } = response;

    if (!rows) {
      return res.status(404).json({
        message: 'Nenhuma categoria encontrada',
      });
    }

    return res.send(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function createCategory(req, res) {
  try {
    const body = req.body;
    const { name } = body;

    const { error } = createCategorySchema.validate(body);
    if (error) {
      const errorsMessageArray = error.details.map((error) => error.message);

      console.log(errorsMessageArray);
      return res.sendStatus(400);
    }

    const { rows } = await connection.query(
      'SELECT * FROM categories WHERE name = $1',
      [name]
    );

    if (rows.length) {
      return res.sendStatus(409);
    }

    await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
