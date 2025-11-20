import { Router } from "express";
import { validateTransaction } from "../validators/validateTransaction.js";
import { transaction } from "../controllers/transactionController.js";
import { verifyJWT } from "../middleWares/verifyJWT.js";

const router = Router();

router.post('/add',verifyJWT, validateTransaction, transaction);

export default router