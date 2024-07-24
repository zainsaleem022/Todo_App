const app = require("../server"); // Import the app directly
const request = require("supertest");

describe('default route "/" GET api test', function () {
  it("should return status 200", function (done) {
    request(app)
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err); // Pass the error to Mocha
        done(); // Indicate that the test is done
      });
  });
});
