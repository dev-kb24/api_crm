import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InputProduct } from './dto/inputProduct';
import { RepositoriesService } from 'src/repositories/repositories.service';
import { OutputProduct } from './dto/outputProduct';
import { InputProductId } from './dto/inputProductId';
import { ProductEntity } from './entities/productEntity';

@Injectable()
export class ProductsService {
    constructor(private readonly repositoriesService: RepositoriesService){}

    async create(inputProduct: InputProduct) : Promise<ProductEntity>{
        const {name} = inputProduct;
        const productExist = await this.repositoriesService.products.findFirst({where:{name:name}});
        if(productExist){
            throw new ConflictException("product already exist");
        }
        return await this.repositoriesService.products.create({data:inputProduct});
    }

    async update(inputProduct: InputProduct, inputProductId : InputProductId) : Promise<ProductEntity> {
        const { productId } = inputProductId;
        await this.findById(inputProductId)
        return await this.repositoriesService.products.update({where:{productId:productId},data:inputProduct});
    }

    async delete(inputProductId : InputProductId) : Promise<ProductEntity> {
        const { productId } = inputProductId;
        await this.findById(inputProductId)
        return await this.repositoriesService.products.delete({where:{productId:productId}})
    }

    async findById(inputProductId : InputProductId) : Promise<ProductEntity> {
        const { productId } = inputProductId;
        const product = await this.repositoriesService.products.findUnique({where:{productId:productId}});
        if(!product){
            throw new NotFoundException(`ProductId : ${productId} not found`);
        }
        return product;
    }

    async findAll() : Promise<ProductEntity[]> {
        return await this.repositoriesService.products.findMany();
    }
}
