import Joi from "joi";

const gameSchema = joi.object({
    name: joi.string().min(1).required(),
    stockTotal: joi.number().min(1)
})