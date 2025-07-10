import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { ProdutoController } from 'src/produto/controller/produto.controller';
import { Produto } from 'src/produto/entities/produto.entity';
import { ProdutoService } from 'src/produto/services/produto.service';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Produto]), CategoriaModule, UsuarioModule],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [ProdutoService],
})
export class ProdutoModule { }
