import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from 'src/core/authz/authz-role.guard';
import { AuthzModule } from 'src/core/authz/authz.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { universityProviders } from './entities/university.entity';
import { UniversityRepository } from './university.repository';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { FacultyModule } from '../faculty/faculty.module';

@Module({
  imports: [DatabaseModule, AuthzModule, FacultyModule],
  controllers: [UniversityController],
  providers: [
    UniversityService,
    UniversityRepository,
    ...universityProviders,
    RolesGuard,
  ],
  exports: [UniversityService, UniversityRepository],
})
export class UniversityModule {}
