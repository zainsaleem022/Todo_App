process.env.NODE_ENV = "TEST";

const app = require("../server");
const request = require("supertest");
const { expect } = require("chai");
const User = require("../classes/User");

describe("Notes API Testing", function () {
  this.timeout(5000);
  let token;
  let userId;
  let test_note_id;
  let testUserName = "Test User";
  let testUserEmail = "test@example.com";
  let testUserPassword = "password123";

  before(async () => {
    const response = await request(app)
      .post("/signup")
      .send({
        name: testUserName,
        email: testUserEmail,
        password: testUserPassword,
      })
      .expect(201);

    token = response.body.token;
    userId = response.body.user.user_id;
  });

  after(async () => {
    await User.removeByEmail(testUserEmail);
  });

  it("should add a new note", function (done) {
    request(app)
      .post("/todo")
      .set("Authorization", `Bearer ${token}`)
      .send({ user_id: userId, note_text: "Test Note" })
      .expect(201)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).to.equal("Note added successfully");
        expect(res.body.note).to.have.property("note_text", "Test Note");
      })
      .end(done);
  });

  it("should get all notes for a specific user", async function () {
    // Use async/await to handle the request
    const response = await request(app)
      .get(`/todo/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /json/);

    test_note_id = response.body[0].note_id;

    // Assert the response data
    expect(response.body).to.be.an("array");
    expect(response.body[0]).to.have.property("note_text", "Test Note");
  });

  it("should update a note", function (done) {
    request(app)
      .put(`/todo/${test_note_id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ note_text: "Updated Note Text" })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).to.equal("Note updated successfully");
        expect(res.body.note).to.have.property(
          "note_text",
          "Updated Note Text"
        );
      })
      .end(done);
  });

  it("should delete a note", function (done) {
    request(app)
      .delete(`/todo/${test_note_id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).to.equal("Note deleted successfully");
      })
      .end(done);
  });

  it("should return 401 if not authorized", function (done) {
    request(app)
      .post("/todo")
      .send({ user_id: 0, note_text: "Test Note" })
      .expect(401)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.message).to.equal("Not authorized, no token");
      })
      .end(done);
  });
});
