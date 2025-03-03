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
    const faculties = await this.facultyRepository.findAll();
    return faculties;
  }
  async findFaculty(id: string): Promise<Faculty> {
    const faculty = await this.facultyRepository.findByPk(id);
    return faculty;
  }
  async findFacultyByUniversityId(id:string): Promise<Faculty[]> {
    const faculties = await this.facultyRepository.findAll({where: {university_id:id}});
    return faculties;
  }
  async updateFaculty(
    id: string,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<boolean> {
    const faculty = await this.facultyRepository.update(
      updateFacultyDto,
      {
        where: { id },
      },
    );
    return Boolean(faculty[0]);
  }
  async removeFaculty(id: string): Promise<boolean> {
    const faculty = await this.facultyRepository.destroy({
      where: { id },
    });
    return Boolean(faculty[0]);
  }

}
