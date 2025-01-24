import { Inject, Injectable } from '@nestjs/common';
import { Faculty } from './entities/faculty.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Injectable()
export class FacultyRepository {
  constructor(
    @Inject('FACULTY_REPOSITORY')
    private facultyRepository: typeof Faculty,
  ) {}
  async createFaculty(
    createFacultyDto: CreateFacultyDto,
  ): Promise<Faculty> {
    return this.facultyRepository.create({ ...createFacultyDto });
  }
  async findAllFaculties(): Promise<Faculty[]> {
    const universities = await this.facultyRepository.findAll();
    return universities;
  }
  async findFaculty(id: string): Promise<Faculty> {
    const university = await this.facultyRepository.findByPk(id);
    return university;
  }
  async updateFaculty(
    id: string,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<boolean> {
    const university = await this.facultyRepository.update(
      updateFacultyDto,
      {
        where: { id },
      },
    );
    return Boolean(university[0]);
  }
  async removeFaculty(id: string): Promise<boolean> {
    const university = await this.facultyRepository.destroy({
      where: { id },
    });
    return Boolean(university[0]);
  }
}
