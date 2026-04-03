const request = require("supertest");
const app = require("../src/app");

describe("user login", () => {
  it("logs user in if credentials are correct", async () => {
    const res = await request(app)
      .post("/auth/login")
      .field("username", "admin1")
      .field("password", "admin1");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.access_token).toBeDefined();
    expect(res.body.data.refresh_token).toBeUndefined();

    const cookies = res.headers["set-cookie"];
    const authCookie = cookies.find((c) => c.startsWith("refresh_token="));

    expect(authCookie).toBeDefined();
    expect(authCookie).toContain("HttpOnly");
    expect(authCookie).toContain("SameSite=Strict");
    // expect(authCookie).toContain("Secure")
  });

  it("does not log user in with wrong credentials", async () => {
    const usernameRes = await request(app)
      .post("/auth/login")
      .field("username", "john")
      .field("password", "doe");

    const passwordRes = await request(app)
      .post("/auth/login")
      .field("username", "admin1")
      .field("password", "not admin");

    expect(usernameRes.statusCode).toBe(401);
    expect(usernameRes.body.success).toBe(false);
    expect(usernameRes.body.message).toBeDefined();

    expect(passwordRes.statusCode).toBe(401);
    expect(passwordRes.body.success).toBe(false);
    expect(passwordRes.body.message).toBeDefined();
  });
});

describe("customer signup", () => {
  it("signs up a customer", async () => {
    const res = await request(app)
      .post("/auth/signup-customer")
      .field("username", "customer2")
      .field("password", "customer2")
      .field("confirm_password", "customer2")
      .field("first_name", "customer")
      .field("last_name", "two")
      .field("email", "customer2@example.com")
      .field("mobile", "+919876543210")
      .field("address", "21 Jane Street, Netherlands")
      .field("pin", "530845");

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.access_token).toBeDefined();
    expect(res.body.data.refresh_token).toBeUndefined();

    const cookies = res.headers["set-cookie"];
    const authCookie = cookies.find((c) => c.startsWith("refresh_token="));

    expect(authCookie).toBeDefined();
    expect(authCookie).toContain("HttpOnly");
    expect(authCookie).toContain("SameSite=Strict");
    // expect(authCookie).toContain("Secure")
  });
});

describe("refresh token", () => {
  it("rejects request if refresh token not provided", async () => {
    const res = await request(app).post("/auth/refresh");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it("rejects request if refresh token is malformed", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", "abc123");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it("refreshes access token using refresh token", async () => {
    const loginRes = await request(app)
      .post("/auth/login")
      .field("username", "customer1")
      .field("password", "customer1");

    const loginCookies = loginRes.headers["set-cookie"];
    const refreshCookie = loginCookies.find((c) =>
      c.startsWith("refresh_token="),
    );

    expect(refreshCookie).toBeDefined();

    const refreshRes = await request(app)
      .post("/auth/refresh")
      .set("Cookie", refreshCookie);

    expect(refreshRes.statusCode).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data.access_token).toBeDefined();
    expect(refreshRes.body.data.refresh_token).toBeUndefined();

    const cookies = refreshRes.headers["set-cookie"];
    const authCookie = cookies.find((c) => c.startsWith("refresh_token="));

    expect(authCookie).toBeDefined();
    expect(authCookie).toContain("HttpOnly");
    expect(authCookie).toContain("SameSite=Strict");
    // expect(authCookie).toContain("Secure")`
  });

  it("detects refresh token reuse", async () => {
    const loginRes1 = await request(app)
      .post("/auth/login")
      .field("username", "customer1")
      .field("password", "customer1");

    const loginCookies1 = loginRes1.headers["set-cookie"];
    const refreshCookie1 = loginCookies1.find((c) =>
      c.startsWith("refresh_token="),
    );

    expect(refreshCookie1).toBeDefined();

    const loginRes2 = await request(app)
      .post("/auth/login")
      .field("username", "customer1")
      .field("password", "customer1")
      .set("Cookie", refreshCookie1);

    const loginCookies2 = loginRes2.headers["set-cookie"];
    const refreshCookie2 = loginCookies2.find((c) =>
      c.startsWith("refresh_token="),
    );

    expect(refreshCookie2).toBeDefined();

    const refreshRes = await request(app)
      .post("/auth/refresh")
      .set("Cookie", refreshCookie1);

    expect(refreshRes.statusCode).toBe(403);
    expect(refreshRes.body.success).toBe(false);
    expect(refreshRes.body.message).toBeDefined();
  });
});
