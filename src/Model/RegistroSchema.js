import Joi from "joi"

export const RegistroSchema = Joi.object({
    date: Joi.date().required(),
    description: Joi.string().required(),
    valor: Joi.number().required()
})