import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class RepositoriesService extends PrismaClient{
    constructor(configService: ConfigService){
        super(
            {
                datasources:{
                    db:{
                        url:configService.get('DATABASE_URL')
                    }
                }
            }
        )
    }
}
