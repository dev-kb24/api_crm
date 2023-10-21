import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RepositoriesService } from 'src/repositories/repositories.service';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {

  constructor(private readonly repositoriesService: RepositoriesService){}

  async create(createOrderDto: CreateOrderDto) : Promise<OrderEntity>
  {
      const {name} = createOrderDto;
      
      await this.searchName(name);

      try {
         return await this.repositoriesService.order.create
      (
        {
          data:
          {...createOrderDto,
            products:{
              connect: createOrderDto.productsId.map((productId) => ({ productId }))
            },
            users:{
              connect: createOrderDto.usersId.map((userId) => ({ userId })),
            }
          },
          include:{products:true,users:true}
        }
      )
      } catch (error) {
        throw new BadRequestException(error);
      }
  }

  async findAll() : Promise<OrderEntity[]>
  {
    return await this.repositoriesService.order.findMany({include:{products:true,users:true}});
  }

  async findById(orderId: string) {
    const order = await this.repositoriesService.order.findUnique({where:{orderId:orderId},include:{users:true,products:true}});
    if(!order){
        throw new NotFoundException(`OrderId : ${orderId} not found`);
    }
    return order;
  }

  async update(orderId: string, updateOrderDto: UpdateOrderDto) {

    const order = await this.findById(orderId);

    const userIdDisconnect = order.users.map((user) => user.userId).filter((userId) => !updateOrderDto.usersId.includes(userId));
    const productIdDisconnect = order.products.map((product) => product.productId).filter((productId) => !updateOrderDto.productsId.includes(productId));
      
    try {
      const orderUpdated = await this.repositoriesService.order.update
      (
        {
          where:{orderId:orderId},
          data:
          {
            ...updateOrderDto,
            products:{
             set:updateOrderDto.productsId.map((productId) => ({ productId }))
            },
            users:{
              set:updateOrderDto.usersId.map((userId) => ({ userId }))
            }
          },
          include:{products:true,users:true}
        }
      )

      await this.updateUser(userIdDisconnect,orderId);

      await this.updateProduct(productIdDisconnect,orderId);

      return orderUpdated;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(orderId: string) : Promise<OrderEntity>
  {
    const order = await this.findById(orderId);
    try {
      const orderDeleted = await this.repositoriesService.order.delete({
        where: { orderId: orderId },
        include: { products: true, users: true }
      });
      await this.updateProduct(orderDeleted.productsId,orderId);
      await this.updateUser(orderDeleted.usersId,orderId);
      return order;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async updateProduct(productIdDisconnect : Array<string>,orderId : string) : Promise<void>
  {
    const products = await this.repositoriesService.products.findMany({ where: { productId: { in: productIdDisconnect } } });
    const productsIds = products.map((product) => product.productId);
    const ordersIds = products.map((product) => product.ordersId.filter((id) => id !== orderId));
    await this.repositoriesService.products.updateMany({
      where: { productId: { in: productsIds } },
      data: { ordersId: { set: ordersIds.flat() } },
    });
  }

  private async updateUser(userIdDisconnect : Array<string>,orderId : string) : Promise<void>
  {
    const users = await this.repositoriesService.users.findMany({ where: { userId: { in: userIdDisconnect } } });
    const userIds = users.map((user) => user.userId);
    const ordersIds = users.map((user) => user.ordersId.filter((id) => id !== orderId));
    await this.repositoriesService.users.updateMany({
      where: { userId: { in: userIds } },
      data: { ordersId: { set: ordersIds.flat() } },
    });
  }

  private async searchName(name: string) : Promise<void>
  {
    const orderNameExist = await this.repositoriesService.order.findFirst({where:{name:name}});
    if(orderNameExist){
        throw new ConflictException("order name already exist");
    }
  }
}
