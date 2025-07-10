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
    await request(app.getHttpServer()).post('/usuarios/cadastrar').send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: '-',
    });

    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({ usuario: 'root@root.com', senha: 'rootroot' });

    token = resposta.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve cadastrar uma nova Categoria', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/categorias')
      .set('Authorization', `${token}`)
      .send({ descricao: 'Categoria Teste' })
      .expect(201);

    categoriaId = resposta.body.id;
    expect(resposta.body.descricao).toBe('Categoria Teste');
  });

  it('02 - Deve listar todas as Categorias', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/categorias')
      .set('Authorization', `${token}`)
      .expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
  });

  it('03 - Deve buscar categoria por descrição', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/categorias/tipo/Categoria Teste')
      .set('Authorization', `${token}`)
      .expect(200);

    expect(resposta.body[0].tipo).toBe('Categoria Teste');
  });

  it('04 - Deve atualizar uma Categoria', async () => {
    const resposta = await request(app.getHttpServer())
      .put('/categorias')
      .set('Authorization', `${token}`)
      .send({ id: categoriaId, tipo: 'Categoria Atualizada' })
      .expect(200);

    expect(resposta.body.tipo).toBe('Categoria Atualizado');
  });

  it('05 - Deve deletar uma Categoria', async () => {
    await request(app.getHttpServer())
      .delete(`/categorias/${categoriaId}`)
      .set('Authorization', `${token}`)
      .expect(204);
  });
});
