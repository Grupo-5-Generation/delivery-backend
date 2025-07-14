import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from './Produto/produto.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';
//import { DevService } from './data/services/dev.service';
import { ProdService } from './data/services/prod.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: ProdService,
      imports: [ConfigModule],
    }),

    CategoriaModule,
    UsuarioModule,
    ProdutoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
