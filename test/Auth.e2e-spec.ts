/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// test/auth.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './app';

let app: INestApplication<App>;

describe('Auth (e2e)', () => {
  beforeAll(async () => {
    app = await setupApp();

    await request(app.getHttpServer()).post('/usuario/cadastrar').send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve autenticar com credenciais válidas', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuario/logar')
      .send({ usuario: 'root@root.com', senha: 'rootroot' })
      .expect(200);

    expect(resposta.body).toHaveProperty('token');
  });

  it('02 - Não deve autenticar com senha inválida', async () => {
    await request(app.getHttpServer())
      .post('/usuario/logar')
      .send({ usuario: 'root@root.com', senha: 'senhaerrada' })
      .expect(401);
  });

  it('03 - Não deve autenticar com usuário inexistente', async () => {
    await request(app.getHttpServer())
      .post('/usuario/logar')
      .send({ usuario: 'naoexiste@email.com', senha: '12345678' })
      .expect(404);
  });
});
