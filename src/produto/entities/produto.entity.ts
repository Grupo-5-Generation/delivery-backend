import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tb_Produto' })
export class Produto {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @ApiProperty()
  @Column({ length: 255, nullable: false })
  nome: string;

  @IsNotEmpty()
  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  quantidade: number;

  @ApiProperty()
  @Column({
    precision: 19,
    scale: 4,
    nullable: true,
    type: 'decimal',
    transformer: {
      to: (value: number) => value, // quando salva no banco
      from: (value: string) => parseFloat(value), // quando lê do banco
    },
  })
  precoAnterior: number;

  @ApiProperty()
  @Column({
    precision: 19,
    scale: 4,
    nullable: true,
    type: 'decimal',
    transformer: {
      to: (value: number) => value, // quando salva no banco
      from: (value: string) => parseFloat(value), // quando lê do banco
    },
  })
  desconto: number;

  @IsNotEmpty()
  @ApiProperty()
  @Column({
    precision: 19,
    scale: 4,
    nullable: false,
    type: 'decimal',
    transformer: {
      to: (value: number) => value, // quando salva no banco
      from: (value: string) => parseFloat(value), // quando lê do banco
    },
  })
  precoAtual: number;

  @IsNotEmpty()
  @ApiProperty()
  @Column({ nullable: false })
  status: boolean;

  @Column({ length: 5000, nullable: true })
  @ApiProperty()
  foto: string;

  @ApiProperty({ type: () => Categoria })
  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    onDelete: 'CASCADE',
  })
  categoria: Categoria;

  @ApiProperty({ type: () => Usuario })
  @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;
}
