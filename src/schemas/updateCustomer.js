import joi from 'joi';

export const updateCustomerSchema = joi.object({
  name: joi.string().trim().required(),
  phone: joi.string().trim().min(10).max(11).pattern(/^\d+$/).required(),
  cpf: joi.string().trim().length(11).pattern(/^\d+$/).required(),
  birthday: joi.date().required(),
});
