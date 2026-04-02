const z = require("zod");
const { getById } = require("./commonSchema");

const addCustomer = z.object({
  body: z.object({
    first_name: z.string().min(3).max(50),
    last_name: z.string().min(3).max(50),
    email: z.email(),
    mobile: z.e164(),
    address: z.string().min(3).max(255),
    pin: z.coerce.number().int().min(100000).max(999999),
  }),
});

const updateCustomer = getById.extend({
  body: addCustomer.shape.body
    .partial()
    .refine((body) => Object.keys(body).length > 0, {
      message:
        "At least one field must be provided to update customer information",
    }),
});

module.exports = {
  addCustomer,
  updateCustomer,
};
