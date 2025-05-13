import { Module } from '@nestjs/common';
import { AuthzModule } from 'src/core/authz/authz.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { facultyProviders } from './entities/faculty.entity';
import { FacultyController } from './faculty.controller';
import { FacultyRepository } from './faculty.repository';
import { FacultyService } from './faculty.service';

@Module({
  imports: [DatabaseModule, AuthzModule],
  controllers: [FacultyController],
  providers: [FacultyService, FacultyRepository, ...facultyProviders],
})
export class FacultyModule {}
