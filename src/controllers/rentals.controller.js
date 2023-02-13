import { db } from "../database/database.connection.js";

export async function getRentals(req, res){
    try {
        console.log('entrou no getRentals');
        const listRentals = await db.query(`
            SELECT rentals.*,
            JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer,
            JSON_BUILD_OBJECT('id', games.id, 'name', games.name) AS game
            FROM rentals
            JOIN customers 
                ON rentals."customerId" = customers.id
            JOIN games 
                ON rentals."gameId" = games.id;`);

        res.status(200).send(listRentals.rows);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postRental(req, res){
    const { customerId, gameId, daysRented } = req.body
    
    try {
        const existCustomer = await db.query(`SELECT * FROM customers WHERE id = $1`, [Number(customerId)]);
        if(!existCustomer.rows.length){
            return res.status(400).send('este aluguel está para um cliente inexistente');
        }
        
        const existGame = await db.query(`SELECT * FROM games WHERE id = $1`, [Number(gameId)]);
        if(!existGame.rows.length){
            return res.status(400).send('este aluguel está para um jogo inexistente');
        }
        
        const gameRent = await db.query(`SELECT "stockTotal" FROM games WHERE id = $1`, [Number(gameId)]);
        let stockGame = gameRent.rows[0].stockTotal;
        
        const rentedGames = await db.query(`SELECT * FROM rentals WHERE id = $1`, [Number(gameId)]);
        let rentedGamesTotal = rentedGames.rows.length;
        
        if((Number(stockGame) - Number(rentedGamesTotal)) <= 0 ){
            return res.status(400).send('este jogo não está disponível');
        }
        
        if(Number(daysRented) <= 0){
            return res.status(400).send('o número de dias alugados deve ser maior que zero');
        }
        console.log('entrou no postRental');

        const gameData = await db.query(`
            SELECT *
            FROM games
            WHERE id = $1`, [Number(gameId)]);
            const totalPrice = (gameData.rows[0].pricePerDay * daysRented);
            
            const rental = await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice")
            VALUES ($1, $2, $3, NOW(), $4)`, [customerId, Number(gameId), Number(daysRented), totalPrice]);
            console.log(rental.rows);
            res.status(201).send('Rental added');

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
        const rental = await db.query(`
            DELETE FROM rentals
            WHERE id = $1`, [Number(req.params.id)]);
        
        const rentalFinished = await db.query(`
            SELECT * FROM rentals
            WHERE id = $1`, [Number(req.params.id)]);
        
        if(rentalFinished.rows[0].returnDate === null){
            return res.status(400).send('este aluguel não foi finalizado');
        }
        
        res.status(200).send('Rental deleted');
    } catch (error) {
        res.status(500).send(error);
    }
}