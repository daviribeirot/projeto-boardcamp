import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import games from "./routers/gamesRoutes.js";
import customers from "./routers/customersRoutes.js";
import rentals from "./routers/rentalsRoutes.js";

dotenv.config();

const server = express();

server.use(cors());
server.use(json());
server.use(games);
server.use(customers);
server.use(rentals);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server is running in port ${PORT}`));