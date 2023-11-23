import { Global, Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
@Global()
@Module({
  providers: [RepositoriesService],
  exports: [RepositoriesService],
})
export class RepositoriesModule {}
