import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { RepositoriesService } from '@/repositories/repositories.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductsService {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  async create(createProductDto: CreateProductDto): Promise<Products> {
    const { name } = createProductDto;
    await this.findName(name);
    try {
      return await this.repositoriesService.products.create({
        data: {
          ...createProductDto,
          order: {
            connect: createProductDto?.ordersId?.map((orderId) => ({
              orderId,
            })),
          },
        },
        include: { order: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async update(
    updateProductDto: UpdateProductDto,
    productId: string,
  ): Promise<Products> {
    await this.findById(productId);
    try {
      return await this.repositoriesService.products.update({
        where: { productId: productId },
        data: updateProductDto,
        include: { order: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async delete(productId: string): Promise<Products> {
    await this.findById(productId);
    try {
      return await this.repositoriesService.products.delete({
        where: { productId: productId },
        include: { order: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findById(productId: string): Promise<Products> {
    let product: Products;
    try {
      product = await this.repositoriesService.products.findUnique({
        where: { productId: productId },
        include: { order: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
    if (!product) {
      throw new NotFoundException(`ProductId : ${productId} not found`);
    }
    return product;
  }

  async findAll(): Promise<Products[]> {
    try {
      return await this.repositoriesService.products.findMany({
        include: { order: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findName(name: string): Promise<void> {
    let productExist: Products;
    try {
      productExist = await this.repositoriesService.products.findFirst({
        where: { name: name },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
    if (productExist) {
      throw new ConflictException('product already exist');
    }
  }
}
