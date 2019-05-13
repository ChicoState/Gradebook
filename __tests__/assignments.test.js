const request = require('supertest');
const app = require('../index.js');

let auth;

describe("User Setup", () => {    
  test("Getting Auth", async () => {
	  const res = await request(app).post("/api/login")
	    .send({email: 'test', password: 'test'});
    auth = res.body.token;
    expect(res.statusCode).toBe(200);
  });
});

describe("Post Valid Assignment", () => {
  const assignment = {
    class_id: "Software Engineering",
    teacher_id: "test",
    name: "Final Project",
    pointsPossible: 100,
    type: "Project"
  };

  test("Should Respond 200", async () => {
    const res = await request(app).post("/api/assignment").send(assignment)
      .set('x-access-token', auth)
      .set('Cookie', "csrf_token=" + auth);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("class_id", "Software Engineering");
    expect(res.body).toHaveProperty("teacher_id", "5cd9b58a2bcef724c095c98c");
    expect(res.body).toHaveProperty("name", "Final Project");
    expect(res.body).toHaveProperty("pointsPossible", 100);
  });
});

describe("Post Invalid Assignment", () => {
  const assignment = {
    pointsPossible: 100
  };

  test("Should Respond 500", async () => {
    const res = await request(app).post("/api/assignment").send(assignment)
      .set('x-access-token', auth)
      .set('Cookie', "csrf_token=" + auth);
    expect(res.statusCode).toBe(500);
  });
});

describe("Get Invalid Assignment", () => {
  test("Should Respond 500", async () => {
  const res = await request(app).get("/api/assignment/not_valid_id")
    .set('x-access-token', auth)
    .set('Cookie', "csrf_token=" + auth);
  expect(res.statusCode).toBe(500);
  });
});

describe("Get Invalid Assignment's Grades", () => {
  test("Should Respond 500", async () => {
  const res = await request(app).get("/api/assignment/not_valid_id/grades")
    .set('x-access-token', auth)
    .set('Cookie', "csrf_token=" + auth);
  expect(res.statusCode).toBe(500);
  expect(res.body).toEqual({});
  });
});