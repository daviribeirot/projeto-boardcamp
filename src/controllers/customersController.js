import { db } from '../database/database.js';

export async function getCustomers(req, res){
    try {
        const customers = await db.query("SELECT * FROM customers");
        res.send(customers.rows)
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function postCustomers(req, res){

    const {name, phone, cpf, birthday} = req.body;

    const customerExists = await db.query(`
    SELECT
      *
    FROM
      customers
    WHERE
      cpf
    ILIKE $1;`, [cpf]);

    if(customerExists.rowCount > 0) {
      return res.sendStatus(409);
    }

    if(!name || name === "") return res.sendStatus(400);

    try {
        await db.query(
            "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getCustomerById(req,res) {

    const { id } = req.params;

    try {
        const customer = await db.query("SELECT * FROM customers WHERE id = $1", [id]);

        if (customer.rowCount === 0) return res.sendStatus(404);

        return res.send(customer.rows[0]);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function updateCustomers(req, res){
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    const cpfExists = await db.query('SELECT id FROM customers WHERE "cpf" = $1 AND "id" != $2', [cpf, id]);
    if (cpfExists.rowCount > 0) return res.sendStatus(409);

    try {
        await db.query("UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;", [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}