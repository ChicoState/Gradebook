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

describe("Get Invalid Course", () => {    
    test("Should Respond 404", async () => {
	const res = await request(app).get("/api/course/list/")
	      .set('x-access-token', auth)
	      .set('Cookie', "csrf_token=" + auth);
    });
});
