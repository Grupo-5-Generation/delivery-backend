import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Produto } from '../../produto/entities/produto.entity';
import { ProdutoService } from '../../produto/services/produto.service';

@ApiTags('Produto')
@UseGuards(JwtAuthGuard)
@Controller('/produto')
@ApiBearerAuth()
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findByAllNome(@Param('nome') nome: string): Promise<Produto[]> {
    return this.produtoService.findAllByNome(nome);
  }

  @Get('/mais-vendidos')
  @HttpCode(HttpStatus.OK)
  getMaisVendidos(
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<Produto[]> {
    return this.produtoService.produtosMaisVendidos(Number(limit));
  }

  @Get('/filtrar')
  @HttpCode(HttpStatus.OK)
  filtrarProdutos(
    @Query('nome') nome?: string,
    @Query('precoAtual') precoAtual?: string,
    @Query('precoAnterior') precoAnterior?: string,
    @Query('desconto') desconto?: string,
    @Query('categoriaId') categoriaId?: string,
  ) {
    const filtro = {
      nome: nome || undefined,
      precoAtual: precoAtual ? Number(precoAtual) : undefined,
      precoAnterior: precoAnterior ? Number(precoAnterior) : undefined,
      desconto: desconto ? Number(desconto) : undefined,
      categoriaId: categoriaId ? Number(categoriaId) : undefined,
    };

    return this.produtoService.filtrarProdutos(filtro);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @Get('/desconto-saudavel/:id')
  @HttpCode(HttpStatus.CREATED)
  findProdutoSaudavel(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findProdutoSaudavel(id);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.update(produto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.delete(id);
  }
}
