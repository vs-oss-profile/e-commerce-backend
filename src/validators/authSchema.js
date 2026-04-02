const z = require("zod");
const { addCustomer } = require("./customerSchema");

const login = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});

const signup = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(3)
        .max(100)
        .regex(/^[a-zA-Z0-9_]+$/, {
          message: "Only letters, numbers, and underscores allowed",
        }),
      password: z.string().min(8).max(100),
      confirmPassword: z.string(),
    })
    .extend(addCustomer.shape.body.shape)
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .transform(({ confirmPassword, ...rest }) => rest),
});

module.exports = { login, signup };
