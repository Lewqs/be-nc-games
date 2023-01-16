const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("App", () => {
  describe("GET /api/categories", () => {
    test("200: Responds with an array of categories objects, each having slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((result) => {
          const {
            body,
            body: { categories },
          } = result;
          expect(body).toHaveProperty("categories");
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
  });
});
