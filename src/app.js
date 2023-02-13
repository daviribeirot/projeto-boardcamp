import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import games from "./routers/gamesRoutes.js";
import customers from "./routers/customersRoutes.js";

dotenv.config();

const server = express();

server.use(cors());
server.use(json());
server.use(games);
server.use(customers);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server is running in port ${PORT}`));