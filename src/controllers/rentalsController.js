import { connection } from '../databases/postgres.js';
import { createRentalSchema } from '../schemas/createRental.js';

export async function createRental(req, res) {
  try {
    const body = req.body;
    const { customerId, gameId, daysRented } = body;

    const { error } = createRentalSchema.validate(body);
    if (error) {
      const errorsMessageArray = error.details.map((error) => error.message);

      console.log(errorsMessageArray);
      return res.sendStatus(400);
    }

    const { rows: customer } = await connection.query(
      'SELECT * FROM customers WHERE id = $1',
      [customerId]
    );
    if (!customer.length) {
      return res.sendStatus(404);
    }

    const { rows: games } = await connection.query(
      'SELECT * FROM games WHERE id = $1',
      [gameId]
    );
    if (!games.length) {
      return res.sendStatus(404);
    }
    const { pricePerDay, stockTotal } = games[0];

    const { rows: rentals } = await connection.query(
      'SELECT * FROM rentals WHERE "gameId" = $1',
      [gameId]
    );
    if (rentals.length >= stockTotal) {
      return res.sendStatus(400);
    }

    const rentDate = new Date().toLocaleDateString('en-ZA');
    const originalPrice = daysRented * pricePerDay;

    // const row = {
    //   customerId,
    //   gameId,
    //   rentDate: new Date().toLocaleDateString('en-ZA'),
    //   daysRented,
    //   returnDate: null,
    //   originalPrice: daysRented * pricePerDay,
    //   delayFee: null,
    // };

    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented",
      "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
