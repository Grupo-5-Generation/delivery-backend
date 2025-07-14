import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaService } from 'src/categoria/services/categoria.service';
import { UsuarioService } from 'src/usuario/services/usuario.service';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';

interface FiltroProduto {
  nome?: string;
  precoAtual?: number;
  precoAnterior?: number;
  desconto?: number;
  categoriaId?: number;
}

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private categoriaService: CategoriaService,
    private usuarioService: UsuarioService,
  ) {}

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations: {
        categoria: true,
        usuario: true,
      },
    });
  }

  async findById(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: {
        id,
      },
      relations: {
        categoria: true,
        usuario: true,
      },
    });

    if (!produto)
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);

    return produto;
  }

  async findAllByNome(nome: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
      relations: {
        categoria: true,
        usuario: true,
      },
    });
  }

  async findProdutoSaudavel(id: number): Promise<Produto> {
    const produto: Produto = await this.findById(id);

    if (!produto) {
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);
    }

    if (produto.categoria?.tipo !== 'Produto saudável') {
      throw new HttpException(
        'Este produto não pertence à categoria Produto saudável.',
        HttpStatus.BAD_REQUEST,
      );
    }

    produto.precoAnterior = produto.precoAtual;
    produto.desconto = produto.precoAtual * 0.1;
    produto.precoAtual = produto.precoAnterior - produto.desconto;

    return await this.produtoRepository.save(produto);
  }

  async filtrarProdutos(filtro: FiltroProduto): Promise<Produto[]> {
    const queryBuilder = this.produtoRepository
      .createQueryBuilder('produto')
      .leftJoinAndSelect('produto.categoria', 'categoria');

    if (filtro.nome) {
      queryBuilder.andWhere('produto.nome LIKE :nome', {
        nome: `%${filtro.nome}%,`,
      });
    }

    if (filtro.precoAtual !== undefined) {
      queryBuilder.andWhere('produto.precoAtual >= :precoAtual', {
        precoAtual: filtro.precoAtual,
      });
    }

    if (filtro.precoAnterior !== undefined) {
      queryBuilder.andWhere('produto.precoAnterior <= :precoAnterior', {
        precoAnterior: filtro.precoAnterior,
      });
    }

    if (filtro.desconto !== undefined) {
      queryBuilder.andWhere('produto.desconto >= :desconto', {
        desconto: filtro.desconto,
      });
    }

    if (filtro.categoriaId !== undefined) {
      queryBuilder.andWhere('produto.categoriaId = :categoriaId', {
        categoriaId: filtro.categoriaId,
      });
    }

    return queryBuilder.getMany();
  }

  async produtosMaisVendidos(limit: number): Promise<Produto[]> {
    return this.produtoRepository.find({
      order: {
        precoAtual: 'DESC',
      },
      take: limit,
      relations: ['categoria'],
    });
  }

  async create(produto: Produto): Promise<Produto> {
    return await this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    await this.findById(produto.id);

    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.produtoRepository.delete(id);
  }
}
