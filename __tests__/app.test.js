const app = require("../app/app.js");
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
    test("200: Responds with the array of review objects, all of which should have all the category types", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toBeGreaterThanOrEqual(1);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("category", expect.any(String));
          });
        });
    });
    test("200: Responds with the array of review objects, all of which only have the category of the queried category", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toBeGreaterThanOrEqual(1);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("category", "dexterity");
          });
        });
    });
    test("200: Responds with each array of review objects sorted by each valid sort_by query (using default order)", () => {
      const requestFunc = (query) => {
        return request(app)
          .get(`/api/reviews?sort_by=${query}`)
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy(query, { descending: true });
          });
      };
      return Promise.all([
        requestFunc("review_id"),
        requestFunc("title"),
        requestFunc("owner"),
        requestFunc("category"),
        requestFunc("created_at"),
        requestFunc("votes"),
        requestFunc("comment_count"),
      ]);
    });
    test("200: Responds with the array of review objects ordered by the queried order (using default sort_by)", () => {
      return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", { descending: false });
        });
    });
    test("200: Valid category query, but no reviews found", () => {
      return request(app)
        .get("/api/reviews?category=children's games")
        .expect(200)
        .then(({ body, body: { reviews } }) => {
          expect(body).toHaveProperty("reviews");
          expect(reviews).toHaveLength(0);
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
    test("200: Responds with a review object, which should have the property: comment_count", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toHaveProperty("comment_count", expect.any(Number));
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
    test("404: if username is not in db", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: 100, body: "This is a test!" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Not Found");
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
        .patch("/api/reviews/1")
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

  describe("DELETE /api/comments/:comment_id", () => {
    test("204: successfully deletes and responds with 'No Content'", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("404: correct data type for the comment_id param, but comment is not found", () => {
      return request(app)
        .delete("/api/comments/100")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Comment ID: 100 Not Found");
        });
    });
    test("400: incorrect data type for the comment_id param", () => {
      return request(app)
        .delete("/api/comments/abc")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
  });

  describe("GET /api", () => {
    test("200: Responds with endpoints object", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body, body: { endpoints } }) => {
          expect(body).toHaveProperty("endpoints");
          expect(Object.keys(endpoints).length).toBeGreaterThanOrEqual(1);
          expect(endpoints).toHaveProperty("GET /api");
          expect(endpoints).toHaveProperty("GET /api/users");
          expect(endpoints).toHaveProperty("GET /api/categories");
          expect(endpoints).toHaveProperty("GET /api/reviews");
          expect(endpoints).toHaveProperty("GET /api/reviews/:review_id");
          expect(endpoints).toHaveProperty(
            "GET /api/reviews/:review_id/comments"
          );
          expect(endpoints).toHaveProperty(
            "POST /api/reviews/:review_id/comments"
          );
          expect(endpoints).toHaveProperty("PATCH /api/reviews/:review_id");
          expect(endpoints).toHaveProperty("DELETE /api/comments/:comment_id");
        });
    });
  });

  describe("GET /api/users/:username", () => {
    test("200: Responds with a user object, which should have the following properties: username, avatar_url and name", () => {
      return request(app)
        .get("/api/users/mallionaire")
        .expect(200)
        .then(({ body, body: { user } }) => {
          expect(body).toHaveProperty("user");
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
        });
    });
    test("404: user not found", () => {
      return request(app)
        .get("/api/users/Lewis")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Username 'Lewis' Not Found");
        });
    });
  });

  describe("PATCH /api/comments/:comment_id", () => {
    test("200: Responds with an updated comment object with the votes incremented correctly", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body, body: { updated_comment } }) => {
          expect(body).toHaveProperty("updated_comment");
          expect(updated_comment).toHaveProperty("comment_id", 1);
          expect(updated_comment).toHaveProperty("votes", 17);
          expect(updated_comment).toHaveProperty("body", expect.any(String));
          expect(updated_comment).toHaveProperty("author", expect.any(String));
          expect(updated_comment).toHaveProperty(
            "created_at",
            expect.any(String)
          );
          expect(updated_comment).toHaveProperty(
            "review_id",
            expect.any(Number)
          );
        });
    });
    test("200: Responds with an updated comment object with the votes decremented correctly", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body, body: { updated_comment } }) => {
          expect(body).toHaveProperty("updated_comment");
          expect(updated_comment).toHaveProperty("comment_id", 1);
          expect(updated_comment).toHaveProperty("votes", 15);
          expect(updated_comment).toHaveProperty("body", expect.any(String));
          expect(updated_comment).toHaveProperty("author", expect.any(String));
          expect(updated_comment).toHaveProperty(
            "created_at",
            expect.any(String)
          );
          expect(updated_comment).toHaveProperty(
            "review_id",
            expect.any(Number)
          );
        });
    });
    test("404: correct data type for the comment_id param, but comment is not found", () => {
      return request(app)
        .patch("/api/comments/100")
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Comment ID '100' Not Found");
        });
    });
    test("400: incorrect data type for the comment_id param", () => {
      return request(app)
        .patch("/api/comments/abc")
        .send({ inc_votes: 100 })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test("400: incorrect data type for the inc_votes property in the request object", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "abc" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
  });

  describe("POST /api/reviews", () => {
    test("201: Returns the new review object", () => {
      return request(app)
        .post("/api/reviews")
        .send({
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          review_body: "Farmyard fun!",
          category: "euro game",
        })
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            review_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    test("400: A required field is empty", () => {
      const badTestReview = {
        title: "",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
        review_body: "Farmyard fun!",
        category: "euro game",
      };
      return request(app)
        .post("/api/reviews")
        .send(badTestReview)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test("400: A required is not included in request body", () => {
      const badTestReview = {
        // Missing "title"
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
        review_body: "Farmyard fun!",
        category: "euro game",
      };
      return request(app)
        .post("/api/reviews")
        .send(badTestReview)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test("404: Owner is not in db", () => {
      const badTestReview = {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "ThisOwnerIsNotInTheDB",
        review_img_url:
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
        review_body: "Farmyard fun!",
        category: "euro game",
      };
      return request(app)
        .post("/api/reviews")
        .send(badTestReview)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Not Found");
        });
    });
  });
});
