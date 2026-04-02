const db = require("../src/clients/db");
const request = require("supertest");
const app = require("../src/app");

afterAll(async () => {
  await db.end();
});

beforeEach(async () => {
  await db.execute("SET FOREIGN_KEY_CHECKS = 0");
  await db.execute("TRUNCATE TABLE category");
  await db.execute("SET FOREIGN_KEY_CHECKS = 1");

  await db.execute(`
    INSERT INTO category (name, description, image)
    VALUES
    ("home", "home category description", "home.png"),
    ("electronics", "computers and stuff", "electronics.png")`);
});

describe("/category", () => {
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
});
