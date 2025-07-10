/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from './app';

let app: INestApplication<App>;
let token: string;
let usuarioId: number;
let categoriaId: number;
let produtoId: number;

describe('Produto (e2e)', () => {
  beforeAll(async () => {
    app = await setupApp();

    // Cadastrar usuário
    const userRes = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      });

    usuarioId = userRes.body.id;

    // Autenticar
    const login = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({ usuario: 'root@root.com', senha: 'rootroot' });

    token = login.body.token;

    // Criar tema
    const categoriaRes = await request(app.getHttpServer())
      .post('/categorias')
      .set('Authorization', `${token}`)
      .send({ descricao: 'Categorias para Produtos' });

    categoriaId = categoriaRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve cadastrar um novo Produto', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/produtos')
      .set('Authorization', `${token}`)
      .send({
        titulo: 'Título Teste',
        texto: 'Nome do produto',
        categoria: { id: categoriaId },
        usuario: { id: usuarioId },
      })
      .expect(201);

    produtoId = resposta.body.id;
    expect(resposta.body.nome).toBe('Produto teste');
  });

  it('02 - Deve listar todos os Produtos', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/produtos')
      .set('Authorization', `${token}`)
      .expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
  });

  it('03 - Deve buscar Produto por Nome', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/postagens/nome/Produto Teste')
      .set('Authorization', `${token}`)
      .expect(200);

    expect(resposta.body[0].nome).toBe('Produto Teste');
  });

  it('04 - Deve atualizar um Produto', async () => {
    const resposta = await request(app.getHttpServer())
      .put('/produtos')
      .set('Authorization', `${token}`)
      .send({
        id: produtoId,
        titulo: 'Nome Atualizado',
        descricao: 'Descrição atualizado',
        categoria: { id: categoriaId },
        usuario: { id: usuarioId },
      })
      .expect(200);

    expect(resposta.body.titulo).toBe('Produto Atualizado');
  });

  it('05 - Deve deletar um Produto', async () => {
    await request(app.getHttpServer())
      .delete(`/produto/${produtoId}`)
      .set('Authorization', `${token}`)
      .expect(204);
  });
});
