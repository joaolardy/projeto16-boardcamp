import { db } from "../database/database.connection.js";

export async function getGames(req, res){
    console.log('entrou no getGames');
    try {
        const gamesLIst = await db.query(`SELECT * FROM games`);
        res.status(200).send(gamesLIst.rows);
    } catch (error) {
        res.status(500);
    }
}

export async function postGame(req, res){

    const { name, image, stockTotal, pricePerDay } = req.body;

    try {

        const existGame = await db.query(`
            SELECT * FROM games WHERE name = $1;`, [name]);

        if(existGame.rows.length){
            return res.status(409).send("Game already exists");
        }

        const newGame = await db.query(`
            INSERT INTO games (name, image, "stockTotal", "pricePerDay") 
            VALUES ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay]);

        res.status(201).send(newGame.rows);
        console.log('Game added');

    } catch (error) {
        res.status(500)
    }
}