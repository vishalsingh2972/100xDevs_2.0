import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '..';
import request from 'supertest';
import resetDb from './helpers/reset-db';

describe('POST /sum', () => {

  //This line executes before each test and resets the DB
  beforeEach(async () => {
    console.log('clearing db');
    await resetDb();
  });

  //This line executes once before all describe blocks and resets the DB
  /*
  beforeAll(async () => {
    console.log('clearing db');
    await resetDb();
  });
  */

  it('should sum add 2 numbers', async () => {
    const { status, body } = await request(app).post('/sum').send({
      a: 1,
      b: 2,
    });
    expect(status).toBe(200);
    expect(body).toEqual({ answer: 3, id: expect.any(Number) });
  });

  it('should sum add 2 negative numbers', async () => {
    const { status, body } = await request(app).post('/sum').send({
      a: -1,
      b: -2,
    });
    expect(status).toBe(200);
    expect(body).toEqual({ answer: -3, id: expect.any(Number) });
  });
});
