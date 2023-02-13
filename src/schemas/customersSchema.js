import joi from "joi";

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required().min(10).max(11),
    cpf: joi.string().required().min(11).max(11).regex(/^[0-9]+$/),
    birthday: joi.date().required()
});