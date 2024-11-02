import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { userProviders } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule,HttpModule],
  controllers: [UserController],
  providers: [UserService,UserRepository,...userProviders],
  exports: [UserService,UserRepository]
})
export class UserModule {}
