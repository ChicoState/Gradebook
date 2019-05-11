const request = require('supertest');
const app = require('../index.js');

describe("Get Invalid Course", () => {
    test("Should Respond 404", async () => {
	const res = await request(app).get("/course/not_valid_id");
	expect(res.statusCode).toBe(404);
    });
});
