import { db } from "../database/database.connection.js";

export async function getCustomerById(req, res){
    const { id } = req.params;
    
    try {
        const customersList = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        res.status(200).send(customersList.rows);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getCustomers(req, res){
    try {
        const customersList = await db.query(`SELECT * FROM customers`);
        res.status(200).send(customersList.rows);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postCustomer(req, res){
    const { name, phone, cpf, birthday } = req.body;
    console.log('entrou postCustomer');
    try {
        const existCustomer = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
        console.log('esse customer já existe e a consulta passou');
        if(existCustomer.rows.length){
            return res.status(409).send("Customer already exists");
        }

        const newCustomer = await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);
        console.log(newCustomer, 'this customer is added');
        res.status(201).send(newCustomer.rows);

    } catch (error) {
        res.status(500);
    }
}

export async function updateCustomer(req, res){
    const { id } = req.params;
    console.log(id, 'esse é o id');
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        if(!customer.rows.length){
            console.log('entrou aqui');
            return res.status(404).send("Customer not found");
        }

        const updatedCustomer = await db.query(`
            UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4
            WHERE id = $5;`, [name, phone, cpf, birthday, id]);
        res.status(200).send(updatedCustomer.rows);

    } catch (error) {
        res.status(500);
    }
}