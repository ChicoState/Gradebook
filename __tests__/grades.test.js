const request = require('supertest');
const app = require('../index.js');

let auth;

describe("User Setup", () => {
  test("Getting Auth", async () => {
    const res = await request(app).post("/api/login")
      .send({ email: 'test', password: 'test' });
    auth = res.body.token;
    expect(res.statusCode).toBe(200);
  });
});

describe("Get Invalid Grade", () => {
  test("Should Respond 404", async () => {
    const res = await request(app).get("/api/grade/assignment/not_valid_id")
      .set('x-access-token', auth)
      .set('Cookie', "csrf_token=" + auth);
    expect(res.statusCode).toBe(404);
  });
});

describe("Get Valid Grade", () => {
  test("Should Respond 200", async () => {
    const res = await request(app).get("/api/grade/assignment/5cd8e7c954b5a00f5234e39d")
      .set('x-access-token', auth)
      .set('Cookie', "csrf_token=" + auth);
    expect(res.statusCode).toBe(200);
  });
});

describe("Get Valid Course", () => {
  test("Should Respond 200", async () => {
    const res = await request(app).get("/api/grade/YOGA101")
      .set('x-access-token', auth)
      .set('Cookie', "csrf_token=" + auth);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("assignment_id", "5cd8f10d6d5d6c121f92bd4f");
    expect(res.body).toHaveProperty("teacher_id", "5cd9b58a2bcef724c095c98c");
  });
});

describe("Get Valid Course List", () => {
  test("Should Respond 200", async () => {
    const res = await request(app).get("/api/grade/list/YOGA101")
      .set('x-access-token', auth)
      .set('Cookie', "csrf_token=" + auth);
    expect(res.statusCode).toBe(200);
  });
});