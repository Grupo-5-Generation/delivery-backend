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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Produto } from '../entities/produto.entity';
import { ProdutoService } from '../services/produto.service';

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

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findByAllNome(@Param('nome') nome: string): Promise<Produto[]> {
    return this.produtoService.findAllByNome(nome);
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

  @Get('/filtrar')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: false,
      skipMissingProperties: true,
    }),
  )
  filtrarProdutos(
    @Query('nome') nome?: string,
    @Query('precoAtual') precoAtual?: string,
    @Query('precoAnterior') precoAnterior?: string,
    @Query('desconto') desconto?: string,
    @Query('categoriaId') categoriaId?: string,
  ) {
    function toNumber(value?: string): number | undefined {
      if (!value) return undefined;
      return Number(value.replace(',', '.'));
    }

    const filtro = {
      nome,
      precoAtual: toNumber(precoAtual),
      precoAnterior: toNumber(precoAnterior),
      desconto: toNumber(desconto),
      categoriaId: toNumber(categoriaId),
    };

    return this.produtoService.filtrarProdutos(filtro);
  }

  @Get('/mais-vendidos/:limit')
  @HttpCode(HttpStatus.OK)
  getMaisVendidos(
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<Produto[]> {
    return this.produtoService.produtosMaisVendidos(limit);
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
