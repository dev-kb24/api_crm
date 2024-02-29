import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { RepositoriesService } from '@/repositories/repositories.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  async create(createProductDto: CreateProductDto): Promise<Products> {
    const { name } = createProductDto;
    const productExist = await this.repositoriesService.products.findFirst({
      where: { name: name },
    });
    if (productExist) {
      throw new ConflictException('product already exist');
    }
    return await this.repositoriesService.products.create({
      data: {
        ...createProductDto,
        order: {
          connect: createProductDto.ordersId.map((orderId) => ({ orderId })),
        },
      },
      include: { order: true },
    });
  }

  async update(
    updateProductDto: UpdateProductDto,
    productId: string,
  ): Promise<Products> {
    await this.findById(productId);
    return await this.repositoriesService.products.update({
      where: { productId: productId },
      data: updateProductDto,
      include: { order: true },
    });
  }

  async delete(productId: string): Promise<Products> {
    await this.findById(productId);
    return await this.repositoriesService.products.delete({
      where: { productId: productId },
      include: { order: true },
    });
  }

  async findById(productId: string): Promise<Products> {
    const product = await this.repositoriesService.products.findUnique({
      where: { productId: productId },
      include: { order: true },
    });
    if (!product) {
      throw new NotFoundException(`ProductId : ${productId} not found`);
    }
    return product;
  }

  async findAll(): Promise<Products[]> {
    return await this.repositoriesService.products.findMany({
      include: { order: true },
    });
  }
}
