import { Body, Controller, Post,Put,Delete, Param } from '@nestjs/common';
import { InputUser } from './dto/inputUser';
import { UsersService } from './users.service';
import { OutputUser } from './dto/outputUser';
import { InputUserPassword } from './dto/inputUserPassword';
import { InputUserId } from './dto/inputUserId';
import { InputUserUpdate } from './dto/inputUserUpdate';

@Controller('users')
export class UsersController {
    constructor(private readonly userService : UsersService){}

    @Post('signup')
    async signup(@Body() inputUser : InputUser) : Promise<OutputUser> {
        return await this.userService.signup(inputUser);
    }

    @Post('signin')
    async signin(@Body() inputUser : InputUser) : Promise<OutputUser> {
        return await this.userService.signin(inputUser);
    }

    @Put('password/:userId')
    async updatePassword(@Body() inputUserPassword : InputUserPassword, @Param() inputUserId : InputUserId) : Promise<OutputUser>{
        return await this.userService.updatePassword(inputUserPassword,inputUserId);
    }

    @Put(':userId')
    async update(@Body() inputUserUpdate : InputUserUpdate, @Param() inputUserId : InputUserId) : Promise<OutputUser>{
        return await this.userService.update(inputUserUpdate,inputUserId);
    }

    @Delete(':userId')
    async delete(@Param() inputUserId : InputUserId) : Promise<OutputUser>{
        return await this.userService.delete(inputUserId);
    }

}
