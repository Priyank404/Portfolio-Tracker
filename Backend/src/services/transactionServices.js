import logger from "../utilities/logger.js";
import { Transaction } from "../models/transactionSchema.js";

export const createTransaction = async({ userId ,type, name, quantity, price, date}) =>{

    try {

        
    const transaction = await Transaction.create({
      user: userId,
      transactionType: type,
      companyName: name,
      quantity,
      pricePerUnite: price,
      date
    });        return transaction

    } catch (error) {
        throw error
    }
}