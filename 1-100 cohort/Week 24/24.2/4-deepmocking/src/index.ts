//vitest with deepmocking + adding a db + prisma + mockReturnValue
import express from "express";
import { z } from "zod";
import { prismaClient } from "./db";

export const app = express();
app.use(express.json());

const sumInput = z.object({
  a: z.number(),
  b: z.number()
})

app.post("/sum", async (req, res) => {
  const parsedResponse = sumInput.safeParse(req.body)

  if (!parsedResponse.success) {
    return res.status(411).json({
      message: "Incorrect inputs"
    })
  }

  const answer = parsedResponse.data.a + parsedResponse.data.b;

  const sum1 = await prismaClient.sum.create({
    data: {
      a: parsedResponse.data.a,
      b: parsedResponse.data.b,
      result: answer
    }
  });

  //console.log(sum1);

  return res.json({
    answer: sum1.result,
    id: sum1.id
  })
});

app.get("/sum", (req, res) => {
  const parsedResponse = sumInput.safeParse({
    a: Number(req.headers["a"]),
    b: Number(req.headers["b"])
  })

  if (!parsedResponse.success) {
    return res.status(411).json({
      message: "Incorrect inputs"
    })
  }

  const answer = parsedResponse.data.a + parsedResponse.data.b;

  return res.json({
    answer
  })
});