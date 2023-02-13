import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchemas.js";
import { rentalSchema } from "../schemas/rentalsSchema.js";
import { createRentals, getRentals } from "../controllers/rentalsController.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateSchema(rentalSchema), createRentals);

export default router;