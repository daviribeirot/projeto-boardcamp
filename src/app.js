import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const server = express();

server.use(cors());
server.use(json);


const PORT = process.env.PORT;
console.log(process.env.DATABASE_URL);
server.listen(PORT, () => console.log(`Server is running in port ${PORT}`));