import { expectedUserEntityMock } from './users.entity.mock';

export class UsersServiceMock {
  signup = jest.fn().mockResolvedValue(expectedUserEntityMock);
  signin = jest.fn().mockResolvedValue(expectedUserEntityMock);
  findById = jest.fn().mockResolvedValue(expectedUserEntityMock);
  updatePassword = jest.fn().mockResolvedValue(expectedUserEntityMock);
  getProfil = jest.fn().mockResolvedValue(expectedUserEntityMock);
  update = jest.fn().mockResolvedValue(expectedUserEntityMock);
  delete = jest.fn().mockResolvedValue("L'utilisateur a été supprimé");
}
