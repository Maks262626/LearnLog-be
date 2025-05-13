import { Injectable } from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { FacultyRepository } from './faculty.repository';

@Injectable()
export class FacultyService {
  constructor(private readonly facultyRepository: FacultyRepository) {}
  create(createFacultyDto: CreateFacultyDto) {
    return this.facultyRepository.createFaculty(createFacultyDto);
  }
  findAll() {
    return this.facultyRepository.findAllFaculties();
  }

  findOne(id: string) {
    return this.facultyRepository.findFaculty(id);
  }

  update(id: string, updateFacultyDto: UpdateFacultyDto) {
    return this.facultyRepository.updateFaculty(id, updateFacultyDto);
  }

  remove(id: string) {
    return this.facultyRepository.removeFaculty(id);
  }

  getFacultiesByUniversityId(id: string) {
    return this.facultyRepository.findFacultyByUniversityId(id);
  }
}
