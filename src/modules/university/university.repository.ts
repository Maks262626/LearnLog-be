import { Inject, Injectable } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { University } from './entities/university.entity';

@Injectable()
export class UniversityRepository {
  constructor(
    @Inject('UNIVERSITY_REPOSITORY')
    private universityRepository: typeof University,
  ) {}
  async createUniversity(createUniversityDto: CreateUniversityDto): Promise<University> {
    return this.universityRepository.create({ ...createUniversityDto });
  }
  async findAllUniversities(): Promise<University[]> {
    const universities = await this.universityRepository.findAll();
    return universities;
  }
  async findUniversity(id: string): Promise<University> {
    const university = await this.universityRepository.findByPk(id);
    return university;
  }
  async updateUniversity(id: string, updateUniversityDto: UpdateUniversityDto): Promise<boolean> {
    const university = await this.universityRepository.update(updateUniversityDto, {
      where: { id },
    });
    return Boolean(university[0]);
  }
  async removeUniversity(id: string): Promise<boolean> {
    const university = await this.universityRepository.destroy({
      where: { id },
    });
    return Boolean(university[0]);
  }
}
