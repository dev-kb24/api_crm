import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserPasswordDto } from "../dto/update-user-password.dto";
import { UserEntity } from "../entity/userEntity";

export const userEntityMock: UserEntity = {
    userId: '1234567891234567',
    email: 'test@test.fr',
    password: 'password',
    firstname: 'firstname',
    lastname: 'lastname'
};

export const expectedUserEntityMock: any = {
    userId: '1234567891234567',
    email: 'test@test.fr',
    firstname: 'firstname',
    lastname: 'lastname',
}

export const createUserDtoMock: CreateUserDto = {
    email: 'test@test.fr',
    password: 'password',
    firstname: 'firstname',
    lastname: 'lastname',
};

export const updateUserDtoMock: CreateUserDto = {
    email: 'test@test.fr',
    password: 'password',
    firstname: 'firstname',
    lastname: 'lastname',
};

export const updateUserPasswordDtoMock: UpdateUserPasswordDto = {
    oldPassword: 'password',
    newPassword: 'newPassword',
};