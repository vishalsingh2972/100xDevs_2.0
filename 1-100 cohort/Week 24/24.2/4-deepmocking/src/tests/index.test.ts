//vitest with deepmocking + adding a db + prisma + mockReturnValue
import { describe, expect, it, vi } from 'vitest';
import request from "supertest";
import { app } from '../index';
import { prismaClient } from '../__mocks__/db'; //importing the mocked dummy fake prismaClient, so here you're manipulating the mock and getting a return value, without making any actual database calls or using the real PrismaClient instance present in src/db.ts.

vi.mock('../db');//same as index0.test.ts, ignore the prsimaClient defined in src/db.ts and use the prismaClient defined in src/__mocks__/db.ts instead, vitest-mock-extended finds the src/__mocks__/db.ts file automatically no need to explicitly tell it here.

describe("POST /sum", () => {
  it("should return the sum of two numbers", async () => {
    //mockReturnValue
    prismaClient.sum.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 2,
      result: 3
    });

    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
    // expect(res.body.id).toBe(1);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).post("/sum").send({});
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe("Incorrect inputs");
  });

});

describe("GET /sum", () => {
  it("should return the sum of two numbers", async () => {

    const res = await request(app).get("/sum").set({
      a: "1",
      b: "2"
    }).send();
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).get("/sum").send();
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe("Incorrect inputs");
  });
});