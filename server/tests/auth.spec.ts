import { describe, test, expect } from "vitest";
import { app } from "../index";
import request from "supertest";

describe("Authentication API", () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    password: "testPassword123!"
  };

  test("should register a new user", async () => {
    const res = await request(app)
      .post("/api/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.username).toBe(testUser.username);
    expect(res.body.email).toBe(testUser.email);
    expect(res.body).not.toHaveProperty("password");
  });

  test("should prevent registration with duplicate username", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        ...testUser,
        email: "another@example.com"
      });

    expect(res.status).toBe(400);
    expect(res.text).toBe("Username already exists");
  });

  test("should allow user to login", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: testUser.username,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.username).toBe(testUser.username);
  });

  test("should prevent login with wrong credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: testUser.username,
        password: "wrongpassword"
      });

    expect(res.status).toBe(401);
  });

  test("should allow authenticated user to access protected route", async () => {
    // First login to get session cookie
    const agent = request.agent(app);
    await agent
      .post("/api/login")
      .send({
        username: testUser.username,
        password: testUser.password
      });

    const res = await agent.get("/api/user");
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(testUser.username);
  });

  test("should prevent unauthenticated access to protected route", async () => {
    const res = await request(app).get("/api/user");
    expect(res.status).toBe(401);
  });

  test("should allow user to logout", async () => {
    const agent = request.agent(app);

    // First login
    await agent
      .post("/api/login")
      .send({
        username: testUser.username,
        password: testUser.password
      });

    // Then logout
    const res = await agent.post("/api/logout");
    expect(res.status).toBe(200);

    // Verify we can't access protected route after logout
    const protectedRes = await agent.get("/api/user");
    expect(protectedRes.status).toBe(401);
  });
});
