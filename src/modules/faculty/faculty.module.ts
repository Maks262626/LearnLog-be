import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { AuthzModule } from 'src/core/authz/authz.module';
import { FacultyRepository } from './faculty.repository';
import { facultyProviders } from './entities/faculty.entity';

@Module({
  imports: [DatabaseModule,AuthzModule],
  controllers: [FacultyController],
  providers: [FacultyService,FacultyRepository,...facultyProviders],
})
export class FacultyModule {}
