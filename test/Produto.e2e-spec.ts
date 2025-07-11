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
      .post('/usuario/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
      });

    usuarioId = userRes.body.id;

    // Autenticar
    const login = await request(app.getHttpServer())
      .post('/usuario/logar')
      .send({ usuario: 'root@root.com', senha: 'rootroot' });

    token = login.body.token;

    // Criar tema
    const categoriaRes = await request(app.getHttpServer())
      .post('/categoria')
      .set('Authorization', `${token}`)
      .send({ descricao: 'Categorias para Produtos' });

    categoriaId = categoriaRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve cadastrar um novo Produto', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/produto')
      .set('Authorization', `${token}`)
      .send({
        nome: 'Produto teste',
        quantidade: '5',
        precoAtual: '10.50',
        precoAnterior: '0.00',
        desconto: '0.00',
        status: '1',
        categoriaid: { id: categoriaId },
        usuarioid: { id: usuarioId },
      })
      .expect(201);

    produtoId = resposta.body.id;
    expect(resposta.body.nome).toBe('Produto teste');
  });

  it('02 - Deve listar todos os Produtos', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/produto')
      .set('Authorization', `${token}`)
      .expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
  });

  it('03 - Deve buscar Produto por Nome', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/produto/nome/Produto Teste')
      .set('Authorization', `${token}`)
      .expect(200);

    expect(Array.isArray(resposta.body)).toBe(true);
  });

  it('04 - Deve atualizar um Produto', async () => {
    const resposta = await request(app.getHttpServer())
      .put('/produto')
      .set('Authorization', `${token}`)
      .send({
        id: produtoId,
        nome: 'Produto Atualizado',
        quantidade: '15',
        precoAtual: '20.50',
        precoAnterior: '10.50',
        desconto: '0.00',
        status: '1',
        categoriaid: { id: categoriaId },
        usuarioid: { id: usuarioId },
      })
      .expect(200);

    expect(resposta.body.nome).toBe('Produto Atualizado');
  });

  it('05 - Deve deletar um Produto', async () => {
    await request(app.getHttpServer())
      .delete(`/produto/${produtoId}`)
      .set('Authorization', `${token}`)
      .expect(204);
  });
});
