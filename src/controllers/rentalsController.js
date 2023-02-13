import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {

    try {
        const rentals = await db.query(`
    SELECT
      rentals.*,
      JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer,
      JSON_BUILD_OBJECT('id', games.id, 'name', games.name) AS game
    FROM
      rentals
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id;
    `);
        res.send(rentals.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export async function createRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format();

    const gameExists = await db.query('SELECT * FROM games WHERE id = $1', [gameId]);
    const gamePricePerDay = gameExists.rows[0].pricePerDay;
    
    if (gameExists.rowCount === 0) return res.sendStatus(400);
    
    const customerExists = await db.query('SELECT * FROM customers WHERE id = $1', [customerId]);

    if (customerExists.rowCount === 0) return res.sendStatus(400);

    const originalPrice = daysRented * gamePricePerDay;

    try {
        await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice") 
            VALUES ($1, $2, $3, $4, $5)`,
            [customerId, gameId, daysRented, rentDate, originalPrice]);

        return res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message);
    }
}