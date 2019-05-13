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

describe("Post Valid Course", () => {
  const course = {
    teacher_id: "test",
    name: "Software Engineering",
    custom_id: "CSCI 430",
    roster: ["test_student1"],
    join_code: "test_join_code",
    startDate: new Date("01.21.2019"),
    endDate: new Date("05.17.2019")
  };

  test("Should Respond 200", async () => {
    const res = await request(app).post("/api/course").send(course)
      .set('x-access-token', auth)
      .set('Cookie', "csrf_token=" + auth);
    expect(res.statusCode).toBe(200);
    // expect(res.body).toHaveProperty("teacher_id", "5cd9b58a2bcef724c095c98c");
    // expect(res.body).toHaveProperty("name", "Software Engineering");
    // expect(res.body).toHaveProperty("custom_id", "CSCI 430");
    // expect(res.body).toHaveProperty("roster", "test_student1");
    // expect(res.body).toHaveProperty("join_code", "test_join_code");
    // expect(res.body).toHaveProperty("startDate", "01.21.2019");
    // expect(res.body).toHaveProperty("endDate", "05.17.2019");
  });
});

describe("Get Invalid Course", () => {
  test("Should Respond 500", async () => {
    const res = await request(app).get("/api/course/not_valid_id")
      .set('x-access-token', auth)
      .set('Cookie', "csrf_token=" + auth);
    expect(res.statusCode).toBe(500);
  });
});