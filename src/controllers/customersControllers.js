import { connection } from '../databases/postgres.js';
import { createCustomerSchema } from '../schemas/createCustomer.js';
import { updateCustomerSchema } from '../schemas/updateCustomer.js';

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

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const { rows: customer } = await connection.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );

    if (!customer.length) {
      return res.status(404).json({
        message: 'Nenhum cliente encontrado',
      });
    }

    return res.send(customer);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function createCustomer(req, res) {
  try {
    const body = req.body;
    const { name, phone, cpf, birthday } = body;

    const { error } = createCustomerSchema.validate(body);
    if (error) {
      const errorsMessageArray = error.details.map((error) => error.message);

      console.log(errorsMessageArray);
      return res.sendStatus(400);
    }

    const { rows: customers } = await connection.query(
      'SELECT * FROM customers WHERE cpf = $1',
      [cpf]
    );
    if (customers.length) {
      return res.sendStatus(409);
    }

    await connection.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function updateCustomer(req, res) {
  const { id } = req.params;
  const body = req.body;
  const { name, phone, cpf, birthday } = body;

  try {
    const { error } = updateCustomerSchema.validate(body);
    if (error) {
      const errorsMessageArray = error.details.map((error) => error.message);

      console.log(errorsMessageArray);
      return res.sendStatus(400);
    }

    const { rows: customer } = await connection.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );
    if (!customer.length) {
      return res.status(404).json({
        message: 'Nenhum cliente encontrado',
      });
    }

    await connection.query(
      `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
      [name, phone, cpf, birthday, id]
    );

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
