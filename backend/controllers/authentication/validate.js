import Joi from "joi";

export const signupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().min(8).required(),
    password: Joi
        .string()
        // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .min(5)
        .required(),
})

export const loginSchema = Joi.object({
  email: Joi.string().min(8).required(),
  password: Joi
    .string()
    // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(5)
    .required(),
});
