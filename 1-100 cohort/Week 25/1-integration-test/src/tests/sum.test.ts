import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '..';
import request from 'supertest';
import resetDb from './helpers/reset-db';

describe('POST /sum', () => {

  //beforeEach and beforeAll are not specific to integration tests, they can be used in unit tests as well.
  //This line executes before every 'it' test runs inside this describe block and resets the DB
  beforeEach(async () => {
    console.log('clearing db');
    await resetDb();
  });

  //This line executes only once before all describe blocks and resets the DB
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