import joi from 'joi';

export const createGameSchema = joi.object({
  name: joi.string().trim().required(),
  image: joi.string().trim().required(),
  stockTotal: joi.number().integer().greater(0).required(),
  pricePerDay: joi.number().integer().greater(0).required(),
  categoryId: joi.number().integer().greater(0).required(),
});
