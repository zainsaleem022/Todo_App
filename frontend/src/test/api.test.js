import { expect } from "chai";
import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../server";

const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const { app } = require("./server");

chai.use(chaiHttp);

describe("dummy test", function () {
  it("should return 2", function () {
    expect(1 + 1).to.equal(2);
  });
});

// ... existing code ...
describe('default route "/" GET api test', () => {
  console.log(require.resolve("../../../backend/server"));

  it("should return status 200", async () => {
    const res = await chai.request(app).get("/");
    expect(res).to.have.status(200);
  });
});
// ... existing code ...
