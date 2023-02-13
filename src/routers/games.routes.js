import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controller.js";

const gamesRoute = Router();

gamesRoute.get('/games', getGames);
gamesRoute.post('/games', postGame);

export default gamesRoute;