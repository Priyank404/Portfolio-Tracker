import logger from '../utilities/logger.js';
import { createTransaction } from '../services/transactionServices.js';
import ApiResponse from '../utilities/apiResponse.js';

export const transaction = async (req, res, next) => {
    try {
        const{type,name,quantity,price,date} = req.body;
        
        const userId = req.user.id;

        logger.info("Transaction attemped");

        const result = await createTransaction({userId,type,name,quantity,price,date});

        logger.info("Transaction successful");

        return res.status(200).json(
            new ApiResponse(200, result, "success")
        )
    } catch (error) {
        logger.error("Error while creating transaction", {error});
        next(error.message);
    }
}