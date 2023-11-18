import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RepositoriesService } from '@/repositories/repositories.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config/dist';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entity/userEntity';

@Injectable()
export class UsersService {
    constructor(private readonly repositoriesService: RepositoriesService, private configService : ConfigService, private jwtService : JwtService){}

    private async hashPassword(password : string) : Promise<string> {
        try {
            const salt = await bcrypt.genSalt(parseInt(this.configService.get('SALT_ROUNDS')))
            return await bcrypt.hash(password,salt);
        } catch (error) {
            throw new ConflictException("Erreur lors du hashage du password" + error);
        }
    }

    async signup (createUserDto : CreateUserDto) : Promise<UserEntity>{
        const {email,password} = createUserDto;
        const userExist = await this.repositoriesService.users.findFirst({where:{email:email}});
        if(userExist){
            throw new ConflictException('User already exist');
        }
        createUserDto.password = await this.hashPassword(password);
        return await this.repositoriesService.users.create({data:createUserDto});
    }

    async signin(createUserDto : CreateUserDto) : Promise<any>{
        const {email,password} = createUserDto;
        const userExist = await this.repositoriesService.users.findFirst({where:{email:email}});
        if(!userExist){
            throw new NotFoundException('User not found');
        }
        if(!await bcrypt.compare(password,userExist.password)){
            throw new UnauthorizedException('Le mot de passe est incorrect');
        }
        const payload = {sub:userExist.userId}
        return {
            user:userExist,
            access_token:await this.jwtService.signAsync(payload)
        }
    }

    async updatePassword(updateUserPasswordDto : UpdateUserPasswordDto, userId : string) : Promise<UserEntity> {
        const userExist = await this.findById(userId);
        const password = await bcrypt.compare(updateUserPasswordDto.oldPassword,userExist.password);
        if(!password){
            throw new ConflictException('Le mot de passe est incorrect');
        }
        const newPassword = await this.hashPassword(updateUserPasswordDto.newPassword);
        return await this.repositoriesService.users.update({where:{userId:userId},data:{password:newPassword}});
    }

    async update(updateUserDto : UpdateUserDto, userId : string) : Promise<UserEntity>{
        await this.findById(userId);
        return await this.repositoriesService.users.update({where:{userId:userId},data:updateUserDto});
    }

    async getProfil(userId:string) : Promise<UserEntity>{
        return await this.findById(userId);
    }

    async delete(userId : string) : Promise<UserEntity>{
        await this.findById(userId);
        return await this.repositoriesService.users.delete({where:{userId:userId}})
    }

    async findById(userId : string) : Promise<UserEntity> {
        const user = await this.repositoriesService.users.findUnique({where:{userId:userId}});
        if(!user){
            throw new NotFoundException(`UserId : ${userId} not found`);
        }
        return user;
    }
}
