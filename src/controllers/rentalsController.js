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

    const games = await db.query('SELECT * FROM games WHERE id = $1', [gameId]);
    const gamePricePerDay = games.rows[0].pricePerDay;
    const gameExists = games.rows.find(item => item.id === gameId && item.stockTotal > 0)

    if(!gameExists) return res.sendStatus(400);

    if (games.rowCount === 0) return res.sendStatus(400);
    
    const compareStock = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`, [gameId])

    if (compareStock.rowCount >= games.rows[0].stockTotal) return res.sendStatus(400);

    const customerExists = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);

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

export async function finishRental(req,res){

    const { id } = req.params;
    const currentDate = dayjs().format();

    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE "id" = $1`, [id]);
        console.log(rental);

        if(!rental.rows[0]) return res.sendStatus(404);
        if(rental.rows[0].returnDate) return res.sendStatus(400);

        const rentDate = dayjs(rental.rows[0].rentDate);

        const daysRented = rental.rows[0].daysRented;
   
        const rentDelay = Math.abs(rentDate.diff(currentDate, 'day'));
       
        const pricePerDay = rental.rows[0].originalPrice / daysRented;

        let delayFee = null;

        if (rentDelay > daysRented){
            delayFee = (rentDelay - daysRented) * pricePerDay;
        } 
        await db.query(`UPDATE rentals SET "returnDate"= $1, "delayFee"= $2 WHERE id = $3;`, [currentDate, delayFee, id]);
        res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error.message);

    }
}

export async function deleteRental(req,res){

    const { id } = req.params;

    try {
       const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
       if(!rental.rows[0]) return res.sendStatus(404);
       if(rental.rows[0].returnDate) return res.sendStatus(400);

        await db.query("DELETE FROM rentals WHERE id = $1;", [id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}