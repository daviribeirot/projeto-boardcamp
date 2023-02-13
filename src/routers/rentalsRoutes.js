import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchemas.js";
import { rentalSchema } from "../schemas/rentalsSchema.js";
import { createRentals, deleteRental, finishRental, getRentals } from "../controllers/rentalsController.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateSchema(rentalSchema), createRentals);
router.post("/rentals/:id/return", finishRental);
router.delete("/rentals/:id", deleteRental);
export default router;