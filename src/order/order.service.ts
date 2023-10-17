import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RepositoriesService } from 'src/repositories/repositories.service';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {

  constructor(private readonly repositoriesService: RepositoriesService){}

  async create(createOrderDto: CreateOrderDto) : Promise<any>
  {
      let orderCreated : any;
      const {name} = createOrderDto;
      
      await this.searchName(name);

      try {
        orderCreated = await this.repositoriesService.order.create
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
      return orderCreated;
      } catch (error) {
        throw new BadRequestException(error);
      }
  }

  async findAll() : Promise<OrderEntity[]>
  {
    return await this.repositoriesService.order.findMany({include:{products:true,users:true}});
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private async searchName(name: string) : Promise<void>
  {
    const orderNameExist = await this.repositoriesService.order.findFirst({where:{name:name}});
    if(orderNameExist){
        throw new ConflictException("order name already exist");
    }
  }
}
