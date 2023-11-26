import { Test, TestingModule } from '@nestjs/testing';
import { UsersGuard } from './users.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersGuard', () => {
  let guard: UsersGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'your-secret-key'),
          },
        },
      ],
    }).compile();

    guard = module.get<UsersGuard>(UsersGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const context = {
      switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
    } as any;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalid-token' },
        }),
      }),
    } as any;

    (guard as any).jwtService.verifyAsync.mockRejectedValueOnce(
      new Error('Invalid token'),
    );

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should set user in request if token is valid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid-token' },
          user: {},
        }),
      }),
    } as any;

    const mockPayload = { userId: 1 };
    (guard as any).jwtService.verifyAsync.mockResolvedValueOnce(mockPayload);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });
});
