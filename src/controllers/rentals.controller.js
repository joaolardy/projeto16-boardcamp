import { db } from "../database/database.connection.js";

export async function getRentals(req, res){
    try {
        const listRentals = await db.query(`
            SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer,
            json_build_object('id', games.id, 'name', games.name) AS game
            FROM rentals
            JOIN customers 
                ON rentals."customerId" = customers.id
            JOIN games 
                ON rentals."gameId" = games.id;
          `);
        res.status(200).send(listRentals.rows);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postRental(req, res){
    const { customerId, gameId, daysRented } = req.body


    try {
        const existCustomer = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
        if(!existCustomer.rows.length){
            return res.status(400).send('este aluguel está para um cliente inexistente');
        }

        const existGame = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
        if(!existGame.rows.length){
            return res.status(400).send('este aluguel está para um jogo inexistente');
        }

        const gameRent = await db.query(`SELECT "stockTotal" FROM games WHERE id = $1`,
        [gameId])
        let stockGame = gameRent.rows[0].stockTotal;

        const rentedGames = await db.query(`SELECT * FROM rentals WHERE id = $1`, [gameId])
        let rentedGamesTotal = rentedGames.rows.length;

        if((Number(stockGame) - rentedGamesTotal) <= 0 ){
            return res.status(400).send('este jogo não está disponível');
        }

        if(Number(daysRented) <= 0){
            return res.status(400).send('o número de dias alugados deve ser maior que zero');
        }

        const rentalDay = await db.query(`
            SELECT "pricePerDay"
            FROM games
            WHERE id = $1`, [gameId]);
        const totalPrice = ((rentalDay.rows[0].pricePerDay) * daysRented);

        const rental = await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee")
            VALUES ($1, $2, $3, NOW(), $4, $5, $5)`, [customerId, gameId, daysRented, totalPrice, null]);
        if(rental.rows.length){
            res.status(201).send('Rental added')
        }

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function finishRental(req, res){
    try {

        res.status(200).send('Rental finished')
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function deleteRental(req, res){
    try {
        
    } catch (error) {
        res.status(500).send(error);
    }
}