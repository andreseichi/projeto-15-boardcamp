import { connection } from '../databases/postgres.js';

export async function getCategories(req, res) {
  try {
    const response = await connection.query('SELECT * FROM customers');
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
