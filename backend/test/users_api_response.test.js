process.env.NODE_ENV = "TEST";

const app = require("../server"); // Import the app directly
const request = require("supertest");
const { expect } = require("chai");
const User = require("../classes/User");

describe('default route "/" GET api test', function () {
  it("should return status 200 and home page message", function (done) {
    request(app)
      .get("/")
      .expect(200)
      .expect("Content-Type", /text/) // Optionally check the Content-Type header
      .expect((res) => {
        if (res.text !== "Welcome to the home page!")
          throw new Error("Response does not contain 'Hello World'");
      })
      .end((err, res) => {
        if (err) return done(err); // Pass the error to Mocha
        done(); // Indicate that the test is done
      });
  });
});

describe("Signup API Test", function () {
  it("should be able to signup by providing name, email, and password", function (done) {
    request(app)
      .post("/signup")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).to.have.property("message", "Signup successful");
        expect(res.body).to.have.property("user");
        expect(res.body.user).to.have.property("name", "Test User");
        expect(res.body.user).to.have.property("email", "test@example.com");
        expect(res.body.user).to.not.have.property("password");
        expect(res.body).to.have.property("token");
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 400 if name, email, or password is missing", function (done) {
    request(app)
      .post("/signup")
      .send({ name: "", email: "test@example.com", password: "password123" })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).to.have.property(
          "message",
          "Name, email, and password are required"
        );
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 400 if email is invalid", function (done) {
    request(app)
      .post("/signup")
      .send({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).to.have.property("message", "Invalid email");
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 500 if there is an internal server error", function (done) {
    request(app)
      .post("/signup")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
      .expect(500)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).to.have.property("message", "Internal server error");
      })
      .end(async (err, res) => {
        try {
          await User.removeByEmail("test@example.com");
          done();
        } catch (cleanupErr) {
          done(cleanupErr);
        }
      });
  });
});

describe("Signin API Test", function () {
  let testUserName = "Test User";
  let testUserEmail = "test@example.com";
  let testUserPassword = "password123";

  before(async () => {
    await request(app)
      .post("/signup")
      .send({
        name: testUserName,
        email: testUserEmail,
        password: testUserPassword,
      })
      .expect(201);
  });

  after(async () => {
    await User.removeByEmail(testUserEmail);
  });

  it("should be able to sign in with correct credentials", function (done) {
    request(app)
      .post("/signin")
      .send({ email: testUserEmail, password: testUserPassword })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).to.have.property("message", "Login successful");
        expect(res.body).to.have.property("user");
        expect(res.body.user).to.have.property("name", testUserName);
        expect(res.body.user).to.have.property("email", testUserEmail);
        expect(res.body.user).to.not.have.property("password");
        expect(res.body).to.have.property("token");
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 400 if email or password is missing", function (done) {
    request(app)
      .post("/signin")
      .send({ email: testUserEmail })
      .expect(400)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).to.have.property(
          "message",
          "Email and password are required"
        );
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 401 if email or password is incorrect", function (done) {
    request(app)
      .post("/signin")
      .send({ email: testUserEmail, password: "wrongpassword" })
      .expect(401)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).to.have.property("message", "Invalid credentials");
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return 500 if there is an internal server error", function (done) {
    // Simulate an error by mocking the User.findByEmail method to throw an error
    const originalFindByEmail = User.findByEmail;
    User.findByEmail = async () => {
      throw new Error("Simulated error");
    };

    request(app)
      .post("/signin")
      .send({ email: testUserEmail, password: testUserPassword })
      .expect(500)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).to.have.property("message", "Internal server error");
      })
      .end((err, res) => {
        // Restore the original method
        User.findByEmail = originalFindByEmail;

        if (err) return done(err);
        done();
      });
  });
});
