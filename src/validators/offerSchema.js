const z = require("zod");
const { idSchema, getById } = require("./commonSchema");

const addOffer = z.object({
  body: z.object({
    product_id: idSchema,
    offer_price: z.coerce.number().int().nonnegative(),
    valid_till: z.iso.datetime(),
  }),
});

const updateOffer = getById
  .extend({
    body: addOffer.shape.body.omit({ product_id: true }).partial(),
  })
  .refine((data) => Object.keys(data.body).length > 0, {
    message: "At least one field is required to change offer information",
  });

module.exports = {
  addOffer,
  updateOffer,
};
