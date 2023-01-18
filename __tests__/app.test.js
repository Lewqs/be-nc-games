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
  test("404: Path Not Found", () => {
    return request(app)
      .get("/api/path-not-found")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Path Not Found");
      });
  });

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
    test(`200: Responds with the array of review objects, each of which should have an owner, title, review_id, category, review_img_url, created_at, votes, designer, and comment_count property`, () => {
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
    test("200: Responds with the array of review objects sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    // Query tests
    test("200: Responds with the array of review objects, all of which only have the category of 'dexterity'", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then(({ body: { reviews } }) => {
          reviews.forEach((review) => {
            expect(review).toHaveProperty("category", "dexterity");
          });
        });
    });
    test("200: Responds with the array of review objects sorted by comment_count (using default order)", () => {
      return request(app)
        .get("/api/reviews?sort_by=comment_count")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("comment_count", { descending: true });
        });
    });
    test("200: Responds with the array of review objects ordered by ascending (using default sort_by)", () => {
      return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", { descending: false });
        });
    });
    test("404: Category not found", () => {
      return request(app)
        .get("/api/reviews?category=test")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Category 'test' Not Found");
        });
    });
    test("400: Invalid sort_by query", () => {
      return request(app)
        .get("/api/reviews?sort_by=test")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request: Enter a valid sort_by query (See endpoints.md)"
          );
        });
    });
    test("400: Invalid order query", () => {
      return request(app)
        .get("/api/reviews?order=test")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Bad Request: Enter a valid order query (asc|desc)"
          );
        });
    });
  });

  describe("GET /api/reviews/:review_id", () => {
    test("200: Responds with a review object, which should have the properties: review_id, title, review_body, designer, review_img_url, votes, category, owner and created_at", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body, body: { review } }) => {
          expect(body).toHaveProperty("review");
          expect(review).toHaveProperty("owner", expect.any(String));
          expect(review).toHaveProperty("title", expect.any(String));
          expect(review).toHaveProperty("review_id", 1);
          expect(review).toHaveProperty("category", expect.any(String));
          expect(review).toHaveProperty("review_img_url", expect.any(String));
          expect(review).toHaveProperty("review_body", expect.any(String));
          expect(review).toHaveProperty("created_at", expect.any(String));
          expect(review).toHaveProperty("votes", expect.any(Number));
          expect(review).toHaveProperty("designer", expect.any(String));
        });
    });
    test("404: correct data type, but review is not found in the data", () => {
      return request(app)
        .get("/api/reviews/100")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Review ID: 100 Not Found");
        });
    });
    test("400: incorrect data type as param", () => {
      return request(app)
        .get("/api/reviews/abc")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
  });

  describe("GET /api/reviews/:review_id/comments", () => {
    test("200: Responds with an array of comments for the given review_id, each comment should have comment_id, votes, created_at, author, body and review_id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body, body: { comments } }) => {
          expect(body).toHaveProperty("comments");
          expect(comments.length).toBeGreaterThanOrEqual(1);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("review_id", 2);
          });
        });
    });
    test("200: Responds with an empty array when the review_id exists but has no comments", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
          expect(comments).toHaveLength(0);
        });
    });
    test("should return the array of comments sorted by created_at with the most recent comments first", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("404: correct data type, but review is not found", () => {
      return request(app)
        .get("/api/reviews/100/comments")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Review ID: 100 Not Found");
        });
    });
    test("400: incorrect data type as param", () => {
      return request(app)
        .get("/api/reviews/abc/comments")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
  });

  describe("POST /api/reviews/:review_id/comments", () => {
    test("201: returns the new comment object", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "mallionaire", body: "This is a test!" })
        .expect(201)
        .then(({ body, body: { comment } }) => {
          expect(body).toHaveProperty("comment");
          expect(comment).toHaveProperty("author", "mallionaire");
          expect(comment).toHaveProperty("body", "This is a test!");
          expect(comment).toHaveProperty("comment_id", 7);
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("review_id", 1);
          expect(comment).toHaveProperty("votes", 0);
        });
    });
    test("404: correct data type for the review_id param, but review is not found", () => {
      return request(app)
        .post("/api/reviews/100/comments")
        .expect(404)
        .send({ username: "mallionaire", body: "This is a test!" })
        .then(({ body: { message } }) => {
          expect(message).toBe("Review ID: 100 Not Found");
        });
    });
    test("400: incorrect data type for the review_id param", () => {
      return request(app)
        .post("/api/reviews/abc/comments")
        .send({ username: "mallionaire", body: "This is a test!" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test("400: incorrect data type for the username value", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: 100, body: "This is a test!" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test("400: request object does not have a username property", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ body: "This is a test!" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test("400: request object does not have a body property", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "mallionaire" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
  });

  describe("PATCH /api/reviews/:review_id", () => {
    test("200: Responds with an updated review object with the votes incremented correctly", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body, body: { updated_review } }) => {
          expect(body).toHaveProperty("updated_review");
          expect(updated_review).toHaveProperty("votes", 2);
          expect(updated_review).toHaveProperty("owner", expect.any(String));
          expect(updated_review).toHaveProperty("title", expect.any(String));
          expect(updated_review).toHaveProperty("review_id", 1);
          expect(updated_review).toHaveProperty("category", expect.any(String));
          expect(updated_review).toHaveProperty(
            "review_img_url",
            expect.any(String)
          );
          expect(updated_review).toHaveProperty(
            "review_body",
            expect.any(String)
          );
          expect(updated_review).toHaveProperty(
            "created_at",
            expect.any(String)
          );
          expect(updated_review).toHaveProperty("designer", expect.any(String));
        });
    });
    test("200: Responds with an updated review object with the votes decremented correctly", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body, body: { updated_review } }) => {
          expect(body).toHaveProperty("updated_review");
          expect(updated_review).toHaveProperty("votes", 0);
          expect(updated_review).toHaveProperty("owner", expect.any(String));
          expect(updated_review).toHaveProperty("title", expect.any(String));
          expect(updated_review).toHaveProperty("review_id", 1);
          expect(updated_review).toHaveProperty("category", expect.any(String));
          expect(updated_review).toHaveProperty(
            "review_img_url",
            expect.any(String)
          );
          expect(updated_review).toHaveProperty(
            "review_body",
            expect.any(String)
          );
          expect(updated_review).toHaveProperty(
            "created_at",
            expect.any(String)
          );
          expect(updated_review).toHaveProperty("designer", expect.any(String));
        });
    });
    test("404: correct data type for the review_id param, but review is not found", () => {
      return request(app)
        .patch("/api/reviews/100")
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Review ID: 100 Not Found");
        });
    });
    test("400: incorrect data type for the review_id param", () => {
      return request(app)
        .patch("/api/reviews/abc")
        .send({ inc_votes: 100 })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test("400: incorrect data type for the inc_votes property in the request object", () => {
      return request(app)
        .patch("/api/reviews/abc")
        .send({ inc_votes: "abc" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
  });

  describe("GET /api/users", () => {
    test("200: Responds with an array of user objects, each having username, name and avatar_url properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body, body: { users } }) => {
          expect(body).toHaveProperty("users");
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
});
