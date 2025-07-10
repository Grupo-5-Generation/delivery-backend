import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Produto } from '../../Produto/entities/produto.entity';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Injectable()
export class DevService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_blogpessoal',
      entities: [Produto, Categoria, Usuario],
      synchronize: true,
    };
  }
}
