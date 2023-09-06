import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RepositoriesService } from 'src/repositories/repositories.service';
import { InputUser } from './dto/inputUser';
import { OutputUser } from './dto/outputUser';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config/dist';
import { InputUserId } from './dto/inputUserId';
import { InputUserPassword } from './dto/inputUserPassword';
import { InputUserUpdate } from './dto/inputUserUpdate';
import { JwtService } from '@nestjs/jwt';

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

    async signup (inputUser : InputUser) : Promise<OutputUser>{
        const {email,password} = inputUser;
        const userExist = await this.repositoriesService.users.findFirst({where:{email:email}});
        if(userExist){
            throw new ConflictException('User already exist');
        }
        inputUser.password = await this.hashPassword(password);
        return await this.repositoriesService.users.create({data:inputUser});
    }

    async signin(inputUser : InputUser) : Promise<any>{
        const {email,password} = inputUser;
        const userExist = await this.repositoriesService.users.findFirst({where:{email:email}});
        if(!userExist){
            throw new NotFoundException('User not found');
        }
        if(!await bcrypt.compare(password,userExist.password)){
            throw new UnauthorizedException('Le mot de passe est incorrect');
        }
        const payload = {sub:userExist.userId}
        return {
            access_token:await this.jwtService.signAsync(payload)
        }
    }

    async updatePassword(inputUserPassword : InputUserPassword, inputUserId : InputUserId) : Promise<OutputUser> {
        const userExist = await this.findById(inputUserId);
        const password = await bcrypt.compare(inputUserPassword.oldPassword,userExist.password);
        if(!password){
            throw new ConflictException('Le mot de passe est incorrect');
        }
        return await this.repositoriesService.users.update({where:{userId:inputUserId.userId},data:{password:inputUserPassword.newPassword}});
    }

    async update(inputUserUpdate : InputUserUpdate, inputUserId:InputUserId) : Promise<OutputUser>{
        await this.findById(inputUserId);
        return await this.repositoriesService.users.update({where:{userId:inputUserId.userId},data:inputUserUpdate});
    }

    async getProfil(inputUserId:InputUserId) : Promise<any>{
        return await this.findById(inputUserId);
    }

    async delete(inputUserId : InputUserId) : Promise<OutputUser>{
        await this.findById(inputUserId);
        return await this.repositoriesService.users.delete({where:{userId:inputUserId.userId}})
    }

    async findById(inputUserId : InputUserId) : Promise<InputUser> {
        const { userId } = inputUserId;
        const user = await this.repositoriesService.users.findUnique({where:{userId:userId}});
        if(!user){
            throw new NotFoundException(`UserId : ${userId} not found`);
        }
        return user;
    }
}
