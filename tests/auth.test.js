const request = require("supertest");
const app = require("../src/app");

it("logs user in if credentials are correct", async () => {
  const res = await request(app)
    .post("/auth/login")
    .field("username", "admin1")
    .field("password", "admin");

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.access_token).toBeDefined();
  expect(res.body.data.refresh_token).toBeDefined();
});

it("does not log user in with wrong credentials", async () => {
  const resUsername = await request(app)
    .post("/auth/login")
    .field("username", "john")
    .field("password", "doe");

  const resPassword = await request(app)
    .post("/auth/login")
    .field("username", "aadmin")
    .field("password", "not admin");

  expect(resUsername.statusCode).toBe(401);
  expect(resUsername.body.success).toBe(false);
  expect(resUsername.body.message).toBeDefined();

  expect(resPassword.statusCode).toBe(401);
  expect(resPassword.body.success).toBe(false);
  expect(resPassword.body.message).toBeDefined();
});

it("signs up a customer", async () => {
  const res = await request(app)
    .post("/auth/signup-customer")
    .field("username", "customer 2")
    .field("password", "customer 2")
    .field("first_name", "customer")
    .field("last_name", "two")
    .field("email", "customer2@example.com")
    .field("mobile", "+91 83982 29388")
    .field("address", "21 Jane Street, Netherlands")
    .field("pin", "530845");

  expect(res.statusCode).toBe(201);
  expect(res.body.success).toBe(true);
  expect(res.body.data.access_token).toBeDefined();
  expect(res.body.data.refresh_token).toBeDefined();
});
