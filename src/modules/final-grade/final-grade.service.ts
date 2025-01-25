import { Injectable } from '@nestjs/common';
import { CreateFinalGradeDto } from './dto/create-final-grade.dto';
import { UpdateFinalGradeDto } from './dto/update-final-grade.dto';
import { FinalGradeRepository } from './final-grade.repository';
import { FinalGrade } from './entities/final-grade.entity';

@Injectable()
export class FinalGradeService {
  constructor(private readonly finalGradeRepository: FinalGradeRepository) { }

  create(createFinalGradeDto: CreateFinalGradeDto): Promise<FinalGrade> {
    return this.finalGradeRepository.createFinalGrade(createFinalGradeDto);
  }

  findAll(): Promise<FinalGrade[]> {
    return this.finalGradeRepository.findAllFinalGrades();
  }

  findOne(id: string): Promise<FinalGrade> {
    return this.finalGradeRepository.findFinalGrade(id);
  }

  update(id: string, updateFinalGradeDto: UpdateFinalGradeDto): Promise<boolean> {
    return this.finalGradeRepository.updateFinalGrade(id, updateFinalGradeDto);
  }

  remove(id: string): Promise<boolean> {
    return this.finalGradeRepository.removeFinalGrade(id);
  }
}
