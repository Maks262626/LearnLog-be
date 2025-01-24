import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { AuthzModule } from 'src/core/authz/authz.module';
import { GroupRepository } from './group.repository';
import { groupProviders } from './entities/group.entity';

@Module({
  imports: [DatabaseModule,AuthzModule],
  controllers: [GroupController],
  providers: [GroupService,GroupRepository,...groupProviders],
})
export class GroupModule {}
