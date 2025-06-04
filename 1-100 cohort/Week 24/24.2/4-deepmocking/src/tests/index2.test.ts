//vitest with deepmocking + adding a db + prisma + mockReturnValue + spys
import { describe, expect, it, vi } from 'vitest';
import request from "supertest";
import { app } from '../index2';
import { prismaClient } from '../__mocks__/db'; 

vi.mock('../db');

describe("POST /sum", () => {
  it("should return the sum of two numbers", async () => {
    //mockReturnValue
    prismaClient.sum.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 2,
      result: 3
    });

    //spy
    vi.spyOn(prismaClient.sum, "create");

    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
    expect(res.body.id).toBe(1);

    //spy checks - here prismaClient.sum.create is checking the actual prismaClient.sum.create present in index2.ts and not the mock prismaClient.sum.create.mockResolvedValue present above
    expect(prismaClient.sum.create).toHaveBeenCalledWith({
      data: {
        a: 1,
        b: 2,
        result: 3
      }
    });
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