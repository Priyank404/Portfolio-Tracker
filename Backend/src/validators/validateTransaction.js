import Joi from "joi";
import logger from "../utilities/logger.js";
import ApiError from "../utilities/apiError.js";

const transactionSchema = Joi.object({
  type: Joi.string()
    .valid("BUY", "SELL")
    .required()
    .messages({
      "any.only": "Type must be either BUY or SELL.",
      "any.required": "Type is required."
    }),

  name: Joi.string()
    .min(1)
    .required()
    .messages({
      "string.empty": "Company name is required.",
      "any.required": "Company name is required."
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Quantity must be a valid number.",
      "number.min": "Quantity must be greater than 0.",
      "any.required": "Quantity is required."
    }),

  price: Joi.number()
    .min(1)
    .required()
    .messages({
      "number.base": "Price must be a valid number.",
      "number.min": "Price must be greater than 0.",
      "any.required": "Price is required."
    }),

  date: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/) // YYYY-MM-DD
    .required()
    .custom((value, helpers) => {
      const [year, month, day] = value.split("-");
      const inputDate = new Date(`${year}-${month}-${day}`);
      const now = new Date();

      if (isNaN(inputDate.getTime())) {
        return helpers.error("any.invalid", { message: "Invalid date." });
      }

      if (inputDate > now) {
        return helpers.error("date.max", { message: "Date cannot be in the future." });
      }

      return value;
    })
    .messages({
      "string.pattern.base": "Date must be in YYYY-MM-DD format.",
      "date.max": "Date cannot be in the future.",
      "any.invalid": "Invalid date.",
      "any.required": "Date is required."
    })
});



export const validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);

  if (error) {
    logger.error("Validation error at Transaction route", {
      error: error.details,
      body: req.body
    });

    return next(new ApiError(400, "Validation error", error.details));
  }

  next();
};

