/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IsNotEmpty } from 'class-validator';
import { Produto } from 'src/produto/entities/produto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// usuario1 N, produto,N 1categoria
// id, tipo e descrição

@Entity({ name: "tb_categorias" })
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number

    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    tipo: string

    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    descricao: string

    @OneToMany(() => Produto, (produto) => produto.categoria)
    produto: Produto[]

}