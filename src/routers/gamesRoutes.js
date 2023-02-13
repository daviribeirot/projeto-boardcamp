import { Router } from "express";
import { getGames, postGames } from "../controllers/gamesController.js";
import { validateSchema } from "../middlewares/validateSchemas.js";
import { gameSchema } from "../schemas/gamesSchema.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", validateSchema(gameSchema), postGames);

export default router;