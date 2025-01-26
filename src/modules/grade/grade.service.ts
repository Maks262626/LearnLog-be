import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradeRepository } from './grade.repository';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradeService {
  constructor(private readonly gradeRepository: GradeRepository) { }

  create(createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.gradeRepository.createGrade({ ...createGradeDto });
  }

  findAll(): Promise<Grade[]> {
    return this.gradeRepository.findAllGrades();
  }

  findOne(id: string): Promise<Grade> {
    return this.gradeRepository.findGrade(id);
  }

  update(id: string, updateGradeDto: UpdateGradeDto): Promise<boolean> {
    return this.gradeRepository.updateGrade(id, updateGradeDto);
  }

  remove(id: string): Promise<boolean> {
    return this.gradeRepository.removeGrade(id);
  }
}
