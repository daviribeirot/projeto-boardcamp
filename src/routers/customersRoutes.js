import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchemas.js";
import { getCustomers, postCustomers, getCustomerById, updateCustomers } from "../controllers/customersController.js";
import { customerSchema } from "../schemas/customersSchema.js";

const router = Router();

router.get("/customers", getCustomers);
router.post("/customers", validateSchema(customerSchema), postCustomers);
router.get("/customers/:id", getCustomerById);
router.put("/customers/:id", validateSchema(customerSchema), updateCustomers);

export default router;