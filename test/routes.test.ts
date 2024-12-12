import supertest from "supertest";
import app from "../src/app";
import { expect } from "chai";
import { User, IUser } from "../src/model";
import sinon from "sinon";

describe("Create, read, update, delete, endpoint testing", () => {
  let findStub: sinon.SinonStub;
  let saveStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;
  let deleteStub: sinon.SinonStub;

  beforeEach(() => {
    findStub = sinon.stub(User, "find").resolves([
      {
        _id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
      },
      {
        _id: "2",
        name: "John Appleseed",
        email: "first.last@gmail.com",
        role: "user",
      },
    ]);

    saveStub = sinon.stub(User.prototype, "save").resolves({
      _id: "3",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
    });

    updateStub = sinon.stub(User, "findByIdAndUpdate").resolves({
      _id: "3",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "user",
    });

    deleteStub = sinon.stub(User, "findByIdAndDelete").resolves({
      _id: "3",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
    });
  });

  afterEach(() => {
    findStub.restore();
    saveStub.restore();
    updateStub.restore();
    deleteStub.restore();
  });

  // create responds with the newly created User object
  // so we can check properties as follows
  it("should create a new user", async () => {
    const res = await supertest(app)
      .post("/create")
      .send({ name: "John Doe", email: "john.doe@example.com", role: "admin" });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("name", "John Doe");
    expect(res.body).to.have.property("email", "john.doe@example.com");
    expect(res.body).to.have.property("role", "admin");
    expect(saveStub.calledOnce).to.be.true;
  });

  // saveStub has only 2 user objects, so we check that
  it("should return all users", async () => {
    const res = await supertest(app).get("/read");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.has.length(2);
    res.body.forEach((user: IUser, index: number) => {
      expect(user).to.have.property("name").that.is.a("string");
      expect(user).to.have.property("email").that.is.a("string");
      expect(user).to.have.property("role").that.is.a("string");
    });

    expect(findStub.calledOnce).to.be.true;
  });

  // we pass an ID, and the updated object to /update/:id
  it("should update a user's name given their ID", async () => {
    const updateData = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "user",
    };
    const res = await supertest(app).put("/update/3").send(updateData);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("name", "Jane Doe");
    expect(res.body).to.have.property("email", "jane.doe@example.com");
    expect(res.body).to.have.property("role", "user");
    expect(updateStub.calledOnce).to.be.true;
    expect(updateStub.calledWith("3", updateData, { new: true })).to.be.true;
  });

  // the /delete/:id route sends back the deleted user, so we can assert its properties
  it("should delete a user's name and email given their ID", async () => {
    const res = await supertest(app).delete("/delete/3");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("name", "John Doe");
    expect(res.body).to.have.property("email", "john.doe@example.com");
    expect(res.body).to.have.property("role", "admin");
    expect(deleteStub.calledOnce).to.be.true;
    expect(deleteStub.calledWith("3")).to.be.true;
  });
});
