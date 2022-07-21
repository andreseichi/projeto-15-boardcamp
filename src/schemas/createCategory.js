import joi from 'joi';

export const createCategorySchema = joi.object({
  name: joi.string().trim().required(),
});
