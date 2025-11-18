import Joi from "joi";
import logger from "../utilities/logger.js";

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(/@(.*)(\.com|\.net)$/)  // Must contain .com or .net
    .required()
    .messages({
      "string.email": "Email must be a valid email address.",
      "string.pattern.base": "Email must end with .com or .net.",
      "any.required": "Email is required."
    }),

  password: Joi.string()
    .min(3)
    .max(12)
    .pattern(/^(?=.*[a-z])/)         // at least one lowercase
    .pattern(/^(?=.*[A-Z])/)         // at least one uppercase
    .pattern(/^(?=.*\d)/)            // at least one digit
    .pattern(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
                                     // at least one special character
    .required()
    .messages({
      "string.min": "Password must be at least 3 characters.",
      "string.max": "Password must not exceed 12 characters.",
      "string.pattern.base":
        "Password must contain at least one uppercase, one lowercase, one number, and one special character.",
      "any.required": "Password is required."
    }),

  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password must match password.",
      "any.required": "Confirm password is required."
    })
});

export const validateSignIn = (req, res, next) =>{
  const { error } = registerSchema.validate(req.body);

  if(error){
    logger.error("Validation error at Register route",{
      error: error.details,
      email: req.body.email
    })

    return next(new ApiError(400, "Validation error", error.details))
  }

  next();
}



