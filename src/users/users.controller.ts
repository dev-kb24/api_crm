import { Body, Controller, Post,Put,Delete, Param, UseGuards, Get, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { InputUser } from './dto/inputUser';
import { UsersService } from './users.service';
import { OutputUser } from './dto/outputUser';
import { InputUserPassword } from './dto/inputUserPassword';
import { InputUserId } from './dto/inputUserId';
import { InputUserUpdate } from './dto/inputUserUpdate';
import { UsersGuard } from './users.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService : UsersService){}

    @UseInterceptors(ClassSerializerInterceptor) 
    @Post('signup')
    async signup(@Body() inputUser : InputUser) : Promise<OutputUser> {
        return new OutputUser(await this.userService.signup(inputUser));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('signin')
    async signin(@Body() inputUser : InputUser) : Promise<any> {
        let signin =  await this.userService.signin(inputUser);
        signin.user = new OutputUser(signin.user);
        return signin;
    }

    @Put('password/:userId')
    async updatePassword(@Body() inputUserPassword : InputUserPassword, @Param() inputUserId : InputUserId) : Promise<any>{
        await this.userService.updatePassword(inputUserPassword,inputUserId);
        return "Le mot de passe a été modifié";
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(UsersGuard)
    @Get('getProfil/:userId')
    async getProfil(@Param() inputUserId : InputUserId) : Promise<OutputUser>{
        return new OutputUser(await this.userService.getProfil(inputUserId));
    }

    @UseGuards(UsersGuard)
    @Put(':userId')
    async update(@Body() inputUserUpdate : InputUserUpdate, @Param() inputUserId : InputUserId) : Promise<OutputUser>{
        return new OutputUser(await this.userService.update(inputUserUpdate,inputUserId));
    }

    @UseGuards(UsersGuard)
    @Delete(':userId')
    async delete(@Param() inputUserId : InputUserId) : Promise<String>{
        await this.userService.delete(inputUserId);
        return "L'utilisateur a été supprimé"
    }

    @UseGuards(UsersGuard)
    @Get('access')
    async access(){
        return "Vous etes Autorisé !";
    }

}
