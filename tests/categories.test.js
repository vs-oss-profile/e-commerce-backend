const request = require("supertest");
const app = require("../src/app");

it("gets all categories", async () => {
  const res = await request(app).get("/categories");

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.length).toBe(2);

  expect(res.body.data[0]).toMatchObject({
    name: "home",
    description: "home category description",
    image: "home.png",
  });
});

it("gets category by id", async () => {
  const res = await request(app).get("/categories/1");

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data).toMatchObject({
    name: "home",
    description: "home category description",
    image: "home.png",
  });
});
