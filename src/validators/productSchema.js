const z = require("zod");
const { idSchema, getById } = require("./commonSchema");

const addProduct = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    category_id: idSchema,
    price: z.coerce.number().int().nonnegative(),
    quantity: z.coerce.number().int().nonnegative(),
  }),
  file: z.any().refine((file) => file !== undefined, {
    message: "Product image is required",
  }),
});

const updateProduct = getById
  .extend({
    body: addProduct.shape.body.partial(),
    file: addProduct.shape.file.optional(),
  })
  .refine(
    (data) => Object.keys(data.body).length > 0 || data.file !== undefined,
    {
      message:
        "At least one field or image is required to change product information",
    },
  );

module.exports = {
  addProduct,
  updateProduct,
};
