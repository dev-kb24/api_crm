export class jwtServiceMock {
    signAsync = jest.fn().mockResolvedValue('token');
}