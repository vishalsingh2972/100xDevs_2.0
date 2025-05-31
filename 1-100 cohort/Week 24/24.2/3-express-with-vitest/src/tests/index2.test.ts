//vitest + adding a db + prisma
import { describe, expect, it, vi } from 'vitest';
import request from "supertest";
import { app } from '../index';

/*MOCKING db-prisma part from TESTING:
- instead of using the real Prisma client from db.ts, use this fake object with a mock create() function.
- prismaClient.sum.create(...) now does nothing during tests, prisma is having no interaction with the db during tests now.
- It won’t connect to your DB.
- It ensures tests are fast, safe, and isolated.*/
//here vi.fn() is a fake empty function which will replace the prismaClient.sum.create function present in index2.ts while testing.
vi.mock('../db', () => ({ //so now Vitest will not use prismaClient defined in src/db.ts but instead use the prismaClient defined here.
  prismaClient: { //dummy fake prisma client
    sum: {
      create: vi.fn() // 👈 fake empty function — does nothing, no calls to db
    }
  }
}));

//POST /sum (body) ~ inputs 'a' and 'b' sent in the body
describe("POST /sum", () => {
  it("should return the sum of two numbers", async () => {
    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  //unsuccessful case test case
  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).post("/sum").send({});
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe("Incorrect inputs");
  });

});

//GET /sum (headers) ~ inputs 'a' and 'b' sent in the headers
describe("GET /sum", () => {
  it("should return the sum of two numbers", async () => {
    const res = await request(app).get("/sum").set({
      a: "1",
      b: "2"
    }).send();
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  //unsuccessful case test case
  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).get("/sum").send();
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe("Incorrect inputs");
  });
});