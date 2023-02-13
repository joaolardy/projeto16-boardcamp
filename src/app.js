import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gamesRoute from "./routers/games.routes.js";
import customersRoute from "./routers/customers.routes.js";
import rentalsRoute from "./routers/rentals.routes.js";

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
app.use(gamesRoute);
app.use(customersRoute);
app.use(rentalsRoute);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})