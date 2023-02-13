import { Router } from "express";
import { getCustomerById, getCustomers, postCustomer, updateCustomer } from "../controllers/customers.controller.js";

const customersRoute = Router();

customersRoute.get('/customers', getCustomers);
customersRoute.get('/customers/:id', getCustomerById);

customersRoute.post('/customers', postCustomer);

customersRoute.put('/customers/:id', updateCustomer);

export default customersRoute;