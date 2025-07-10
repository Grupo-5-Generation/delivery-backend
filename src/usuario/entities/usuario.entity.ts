/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Produto } from "src/produto/entities/produto.entity";


@Entity({ name: "tb_usuario" })
export class Usuario {

    @PrimaryGeneratedColumn()
   // @ApiProperty()
    id: number

    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
   // @ApiProperty()
    nome: string

    @IsEmail()
    @Column({ length: 255, nullable: false })
   // @ApiProperty({ example: "email@email.com.br" })
    usuario: string

    @IsNotEmpty()
    @MinLength(8)
    @Column({ length: 255, nullable: false })
   // @ApiProperty()
    senha: string

    @Column({ length: 5000 })
   // @ApiProperty()
    foto: string

    // @ApiProperty()
    @OneToMany(() => Produto, (produto) => produto.usuario)
    produto: Produto[]

}