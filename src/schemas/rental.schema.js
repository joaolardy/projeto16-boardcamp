import joi from "joi";

export const rentalSchema = joi.object({
    customerId: joi.number().min(0).integer().required(),
    gameId: joi.number().min(0).integer().required(),
    daysRented: joi.number().min(1).integer().required(),
})