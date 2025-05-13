import { Module } from '@nestjs/common';
import { AuthzModule } from 'src/core/authz/authz.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { RolesGuard } from 'src/shared/guards/authz-role.guard';
import { FacultyModule } from '../faculty/faculty.module';
import { universityProviders } from './entities/university.entity';
import { UniversityController } from './university.controller';
import { UniversityRepository } from './university.repository';
import { UniversityService } from './university.service';

@Module({
  imports: [DatabaseModule, AuthzModule, FacultyModule],
  controllers: [UniversityController],
  providers: [UniversityService, UniversityRepository, ...universityProviders, RolesGuard],
  exports: [UniversityService, UniversityRepository],
})
export class UniversityModule {}
