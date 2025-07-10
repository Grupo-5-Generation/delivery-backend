import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './Produto/entities/produto.entity';
import { ProdutoModule } from './Produto/produto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_delivery',
      entities: [Produto],
      synchronize: false,
    }),
    ProdutoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
