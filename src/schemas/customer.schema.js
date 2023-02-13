import joi from "joi";

const customerSchema = joi.object({
    name: joi.string().min(1).required(),
    cpf: joi.string().regex(/^[0-9]{11}$/).required(),
    phone: joi.string.regex(/^[0-9]{10,11}$/),
    birthday: joi.date()
});
