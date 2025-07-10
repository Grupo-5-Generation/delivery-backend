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
  preco: number;

  @IsNotEmpty()
  @ApiProperty()
  @Column({ nullable: false })
  status: boolean;

  @ApiProperty()
  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    onDelete: 'CASCADE',
  })
  categoria: Categoria;

  @ApiProperty()
  @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;
}
