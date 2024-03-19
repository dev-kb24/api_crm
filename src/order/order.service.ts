import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RepositoriesService } from '@/repositories/repositories.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { name } = createOrderDto;
    await this.searchName(name);
    try {
      return await this.repositoriesService.order.create({
        data: {
          ...createOrderDto,
          products: {
            connect: createOrderDto?.productsId?.map((productId) => ({
              productId,
            })),
          },
          users: {
            connect: createOrderDto?.usersId?.map((userId) => ({ userId })),
          },
        },
        include: { products: true, users: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      return await this.repositoriesService.order.findMany({
        include: { products: true, users: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findById(orderId: string): Promise<Order> {
    let order: Order;
    try {
      order = await this.repositoriesService.order.findUnique({
        where: { orderId: orderId },
        include: { users: true, products: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
    if (!order) {
      throw new NotFoundException(`OrderId : ${orderId} not found`);
    }
    return order;
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      return await this.repositoriesService.order.update({
        where: { orderId: orderId },
        data: {
          ...updateOrderDto,
          products: {
            set: updateOrderDto?.productsId?.map((productId) => ({
              productId,
            })),
          },
          users: {
            set: updateOrderDto?.usersId?.map((userId) => ({ userId })),
          },
        },
        include: { products: true, users: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async delete(orderId: string): Promise<Order> {
    try {
      return await this.repositoriesService.order.delete({
        where: { orderId: orderId },
        include: { products: true, users: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async searchName(name: string): Promise<void> {
    let orderNameExist: Order;
    try {
      orderNameExist = await this.repositoriesService.order.findFirst({
        where: { name: name },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
    if (orderNameExist) {
      throw new ConflictException('order name already exist');
    }
  }
}
