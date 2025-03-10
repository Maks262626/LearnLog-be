import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { AuthzModule } from 'src/core/authz/authz.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { userProviders } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, HttpModule, forwardRef(() => AuthzModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...userProviders],
  exports: [UserService, UserRepository],
})
export class UserModule {}
