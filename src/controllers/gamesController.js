import { db } from '../database/database.js';

export async function getGames(req, res){
    try {
        const games = await db.query("SELECT * FROM games");
        res.send(games.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function postGames(req, res){
    const {name, image, stockTotal, pricePerDay} = req.body;

    if(!name || stockTotal <= 0 && pricePerDay <= 0) return res.sendStatus(400);

    const gameExists =
            await db.query("SELECT * FROM games WHERE name = $1;", [name]);


        if (gameExists.rows.length !== 0) {
            return res.sendStatus(409);
        }
    try {
        await db.query(
            'INSERT INTO games ("name", "image", "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
            [name, image, stockTotal, pricePerDay]
        );
        return res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}