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
          expect(categories.length).toBeGreaterThanOrEqual(1);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
  });
  describe("GET /api/reviews", () => {
    test(`200: Responds with and array of review objects, each of which should have an owner, title, review_id, category, review_img_url, created_at, votes, designer, and comment_count property`, () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body, body: { reviews } }) => {
          expect(body).toHaveProperty("reviews");
          expect(reviews.length).toBeGreaterThanOrEqual(1);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("review_id", expect.any(Number));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("created_at", expect.any(String));
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("comment_count", expect.any(Number));
          });
        });
    });
    test("should return the array of review objects sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
});
