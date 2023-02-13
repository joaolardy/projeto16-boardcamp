import { Router } from "express";
import { getRentals, postRental, finishRental, deleteRental } from "../controllers/rentals.controller.js";

const rentalsRoute = Router();

rentalsRoute.get('/rentals', getRentals);
rentalsRoute.post('/rentals', postRental);
// rentalsRoute.post('/rentals/:id/return', finishRental);
rentalsRoute.delete('/rentals/:id', deleteRental);

export default rentalsRoute;