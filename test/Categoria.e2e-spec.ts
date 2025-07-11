/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// test/tema.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './app';

let app: INestApplication<App>;
let token: string;
let categoriaId: number;

describe('Categoria (e2e)', () => {
  beforeAll(async () => {
    app = await setupApp();

    // Cadastrar usuário e autenticar
    await request(app.getHttpServer()).post('/usuario/cadastrar').send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
    });

    const resposta = await request(app.getHttpServer())
      .post('/usuario/logar')
      .send({ usuario: 'root@root.com', senha: 'rootroot' });

    token = resposta.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve cadastrar uma nova Categoria', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/categoria')
      .set('Authorization', `${token}`)
      .send({ tipo: 'Teste Tipo de categoria', descricao: 'Categoria Teste' })
      .expect(201);

    categoriaId = resposta.body.id;
    expect(resposta.body.descricao).toBe('Categoria Teste');
  });

  it('02 - Deve listar todas as Categorias', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/categoria')
      .set('Authorization', `${token}`)
      .expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
  });

  it('03 - Deve buscar categoria por tipo', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/categoria/tipo/Categoria Teste')
      .set('Authorization', `${token}`)
      .expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
  });

  it('04 - Deve atualizar uma Categoria', async () => {
    const resposta = await request(app.getHttpServer())
      .put('/categoria')
      .set('Authorization', `${token}`)
      .send({
        id: categoriaId,
        tipo: 'Categoria Atualizada',
        descricao: 'Descricao atualizada',
      })
      .expect(200);

    expect(resposta.body.tipo).toBe('Categoria Atualizada');
  });

  it('05 - Deve deletar uma Categoria', async () => {
    await request(app.getHttpServer())
      .delete(`/categoria/${categoriaId}`)
      .set('Authorization', `${token}`)
      .expect(204);
  });
});
