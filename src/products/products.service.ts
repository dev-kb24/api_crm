import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { RepositoriesService } from '@/repositories/repositories.service';
import { ProductEntity } from './entities/productEntity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  async create(inputProduct: CreateProductDto): Promise<ProductEntity> {
    const { name } = inputProduct;
    const productExist = await this.repositoriesService.products.findFirst({
      where: { name: name },
    });
    if (productExist) {
      throw new ConflictException('product already exist');
    }
    return await this.repositoriesService.products.create({
      data: inputProduct,
    });
  }

  async update(
    inputProduct: UpdateProductDto,
    productId: string,
  ): Promise<ProductEntity> {
    await this.findById(productId);
    return await this.repositoriesService.products.update({
      where: { productId: productId },
      data: inputProduct,
    });
  }

  async delete(productId: string): Promise<ProductEntity> {
    await this.findById(productId);
    return await this.repositoriesService.products.delete({
      where: { productId: productId },
    });
  }

  async findById(productId: string): Promise<ProductEntity> {
    const product = await this.repositoriesService.products.findUnique({
      where: { productId: productId },
      include: { order: true },
    });
    if (!product) {
      throw new NotFoundException(`ProductId : ${productId} not found`);
    }
    return product;
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.repositoriesService.products.findMany({
      include: { order: true },
    });
  }
}
