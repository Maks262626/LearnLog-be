import { Injectable } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { UniversityRepository } from './university.repository';
import { FacultyRepository } from '../faculty/faculty.repository';

@Injectable()
export class UniversityService {
  constructor(
    private readonly universityRepository: UniversityRepository,
  ) {}
  createUniversity(createUniversityDto: CreateUniversityDto) {
    return this.universityRepository.createUniversity(createUniversityDto);
  }

  findAllUniversities() {
    return this.universityRepository.findAllUniversities();
  }

  findUniversity(id: string) {
    return this.universityRepository.findUniversity(id);
  }

  updateUniversity(id: string, updateUniversityDto: UpdateUniversityDto) {
    return this.universityRepository.updateUniversity(id, updateUniversityDto);
  }

  removeUniversity(id: string) {
    return this.universityRepository.removeUniversity(id);
  }
}
