const z = require("zod");
const { getById } = require("./commonSchema");

const addCategory = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    description: z.string().max(500),
  }),
  file: z.any().refine((file) => file !== undefined, {
    message: "Please upload an image for the category",
  }),
});

const updateCategory = getById.extend({
  body: addCategory.shape.body
    .partial()
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field must be provided to update category",
    }),
});

module.exports = {
  addCategory,
  updateCategory,
};
