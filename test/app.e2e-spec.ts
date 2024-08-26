/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get /users/ Returns an array of users with an ok status code', async () => {
    const req = await request(app.getHttpServer()).get('/users');

    expect(req.status).toBe(200)
    expect(req.body).toBeInstanceOf(Array)
  })

  it('Get /users/:id returns an user with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users/de675507-5cab-4396-8709-7f62d7bdc3e5');

    expect(req.status).toBe(200)
    expect(req.body).toBeInstanceOf(Object)
  })

  it('Get /users/:id throws a NotFoundException if the user does not exist', async () => {
    const req = await request(app.getHttpServer()).get('/users/de675507-5cab-4396-8709-7f62d7bdc3e4');

    expect(req.status).toBe(404)
    expect(req.body.message).toBe('Usuario no encontrado')
  })

  it('Get /users/:id throws an error if id is not a UUID', async () => {
    const req = await request(app.getHttpServer()).get('/users/not-a-uuid');

    expect(req.status).toBe(400)
    expect(req.body).toBeInstanceOf(Object)
  })

  it('Post /users/signup creates an user with an OK status code', async () => {
    const req = await request(app.getHttpServer()).post('/users/signup').send({
      email: 'test@test.com',
      password: '123456',
      name: 'test'
    })
    expect(req.status).toBe(201)
    expect(req.body).toBeInstanceOf(Object)
  });
})