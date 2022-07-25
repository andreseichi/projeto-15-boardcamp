import joi from 'joi';

export const createRentalSchema = joi.object({
  customerId: joi.number().required(),
  gameId: joi.number().required(),
  daysRented: joi.number().greater(0).required(),
});
