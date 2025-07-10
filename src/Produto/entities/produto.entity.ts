import { IsNotEmpty } from 'class-validator';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tb_Produto' })
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  nome: string;

  @IsNotEmpty()
  @Column({ type: 'int', nullable: false })
  quantidade: number;

  @IsNotEmpty()
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
  @Column({ nullable: false })
  status: boolean;

  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    onDelete: 'CASCADE',
  })
  categoria: Categoria;

  @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;
}
