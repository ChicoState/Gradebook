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
/*
describe("Creating a Course", () => {
    test("Bad payload", async () => {
	const res = await request(app).post("/api/course/")
	      .auth('username', 'password')
	      .send({bad: 'payload'});
	expect(res.statusCode).toBe(403);
    });

    test("What goes around...", async () => {
	const res = await request(app).post("/api/course/")
	      .send({name: 'Intro to Testing', custom_id: 'TEST 101'});
	expect(res.statusCode).toBe(403);
	//expect(res.body).toEqual('Intro to Testing');
	//expect(res.body.custom_id).toEqual('TEST 101');
    }); 
});

describe("Schools out", () => {
    test("Deleteing a Class", async () => {
	const res = await request(app).delete("/api/class/Test 101");
	expect(res.statusCode).toBe(403);
    });
});
*/
