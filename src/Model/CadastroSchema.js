import Joi from "joi"

export const CadastroSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().required(),
    confirmPassword: Joi.ref('password')
})