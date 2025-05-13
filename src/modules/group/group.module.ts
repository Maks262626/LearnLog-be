import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { UserModule } from '../user/user.module';
import { groupProviders } from './entities/group.entity';
import { GroupController } from './group.controller';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, ...groupProviders],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
