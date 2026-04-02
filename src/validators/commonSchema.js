const z = require("zod");

const idSchema = z.coerce.number().int().positive();

const getById = z.object({
  params: z.object({
    id: idSchema,
  }),
});

const deleteSomething = getById;

const getByCategoryOptional = z.object({
  query: z.object({ category_id: idSchema.optional() }),
});

module.exports = {
  idSchema,
  getById,
  deleteSomething,
  getByCategoryOptional,
};
