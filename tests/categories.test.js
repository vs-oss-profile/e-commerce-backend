const request = require("supertest");
const app = require("../src/app");
const fs = require("fs/promises");
const path = require("path");

it("gets all categories", async () => {
  const res = await request(app).get("/categories");

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.length).toBe(1);

  expect(res.body.data[0]).toMatchObject({
    name: "category1",
    description: "category one description",
    image: "file_example_PNG_500kB.png",
  });
});

it("gets category by id", async () => {
  const res = await request(app).get("/categories/1");

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data).toMatchObject({
    name: "category1",
    description: "category one description",
    image: "file_example_PNG_500kB.png",
  });
});

it("allows admin to add a new category", async () => {
  const loginRes = await request(app)
    .post("/auth/login")
    .field("username", "admin1")
    .field("password", "admin1");

  const res = await request(app)
    .post("/categories")
    .set("Authorization", `Bearer ${loginRes.body.data.access_token}`)
    .field("name", "category2")
    .field("description", "category two description")
    .attach(
      "image",
      path.join(__dirname, "./fixtures/file_example_PNG_500kB.png"),
    );

  expect(res.statusCode).toBe(201);
  expect(res.body.success).toBe(true);
  expect(res.body.data.id).toBeDefined();

  // delete the file uploaded by this test
  const infoRes = await request(app).get(`/categories/${res.body.data.id}`);

  const imageName = infoRes.body.data.image;
  await fs.unlink(path.join(__dirname, `../uploads/${imageName}`));
});

it("denies customers to add a new category", async () => {
  const loginRes = await request(app)
    .post("/auth/login")
    .field("username", "customer1")
    .field("password", "customer1");

  const res = await request(app)
    .post("/categories")
    .set("Authorization", `Bearer ${loginRes.body.data.access_token}`)
    .field("name", "category2")
    .field("description", "category two description")
    .attach(
      "image",
      path.join(__dirname, "./fixtures/file_example_PNG_500kB.png"),
    );

  expect(res.statusCode).toBe(403);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBeDefined();
});
