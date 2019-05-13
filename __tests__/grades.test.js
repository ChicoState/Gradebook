const request = require('supertest');
const app = require('../index.js');

describe("Get Invalid Course", () => {
  test("Should Respond 404", async () => {
    const res = await request(app).get("/api/course/");
    expect(res.statusCode).toBe(404);
  });
});

describe("Get Invalid Course", () => {
  test("Should Respond 404", async () => {
    const res = await request(app).get("/api/grade/not_valid_id");
    expect(res.statusCode).toBe(404);
  });
});

/*

describe("Post Valid Assignment", () => {
  const assignment = {
    class_id: "Software Engineering",
    teacher_id: "test_teacher_id",
    name: "Final Project",
    pointsPossible: 100,
    type: "Project"
  };

  test("Should Respond 200", async () => {
    const res = await request(app).post("/api/assignment").send(assignment);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Final Project");
  });
});

describe("Post Invalid Assignment", () => {
  const assignment = {
    pointsPossible: 100
  };

  test("Should Respond 500", async () => {
    const res = await request(app).post("/api/assignment").send(assignment);
    expect(res.statusCode).toBe(500);
  });
});

describe("Get Invalid Assignment", () => {
  test("Should Respond 404", async () => {
    const res = await request(app).get("/api/assignment/not_valid_id");
    expect(res.statusCode).toBe(500);
  });
});

*/