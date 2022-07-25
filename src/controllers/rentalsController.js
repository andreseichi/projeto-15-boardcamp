import { connection } from '../databases/postgres.js';
import { createRentalSchema } from '../schemas/createRental.js';

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;
  const rentalsRows = [];

  try {
    const query = `SELECT rentals.*, customers.name AS "customerName",
      games.name as "gameName", games."categoryId", 
      categories.name AS "categoryName"
      FROM rentals
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON games."categoryId" = categories.id
      JOIN customers ON rentals."customerId" = customers.id
    `;

    if (customerId) {
      const { rows: rentals } = await connection.query(
        `${query} WHERE rentals."customerId" = $1`,
        [customerId]
      );

      rentalsRows.push(...rentals);
    } else {
      if (gameId) {
        const { rows: rentals } = await connection.query(
          `${query} WHERE rentals."gameId" = $1`,
          [gameId]
        );

        rentalsRows.push(...rentals);
      } else {
        const { rows: rentals } = await connection.query(`${query}`);
        rentalsRows.push(...rentals);
      }
    }

    const rentalsArray = [];

    rentalsRows.map((rental) => {
      rentalsArray.push({
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: {
          id: rental.customerId,
          name: rental.customerName,
        },
        game: {
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName,
        },
      });
    });

    return res.json(rentalsArray);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

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
    if (rentals.length > stockTotal) {
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

export async function deleteRental(req, res) {
  try {
    const { id } = req.params;

    const { rows: rentals } = await connection.query(
      'SELECT * FROM rentals WHERE id = $1',
      [id]
    );
    if (!rentals.length) {
      return res.sendStatus(404);
    }

    if (!rentals[0].returnDate) {
      return res.sendStatus(400);
    }

    await connection.query('DELETE FROM rentals WHERE id = $1', [id]);

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
